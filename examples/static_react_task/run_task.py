#!/usr/bin/env python3

# Copyright (c) Facebook, Inc. and its affiliates.
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

import os
import shutil
import subprocess
from mephisto.operations.operator import Operator
from mephisto.operations.utils import get_root_dir
from mephisto.tools.scripts import load_db_and_process_config
from mephisto.abstractions.blueprints.abstract.static_task.static_blueprint import (
    SharedStaticTaskState,
)

import hydra
from omegaconf import DictConfig
from dataclasses import dataclass, field
from typing import List, Any
import json

TASK_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

defaults = ["_self_", {"conf": "example"}]

from mephisto.operations.hydra_config import RunScriptConfig, register_script_config


@dataclass
class TestScriptConfig(RunScriptConfig):
    defaults: List[Any] = field(default_factory=lambda: defaults)
    task_dir: str = TASK_DIRECTORY

register_script_config(name="scriptconfig", module=TestScriptConfig)


# TODO it would be nice if this was automated in the way that it
# is for ParlAI custom frontend tasks
def build_task(task_dir):
    """Rebuild the frontend for this task"""

    frontend_source_dir = os.path.join(task_dir, "webapp")
    frontend_build_dir = os.path.join(frontend_source_dir, "build")

    return_dir = os.getcwd()
    os.chdir(frontend_source_dir)
    if os.path.exists(frontend_build_dir):
        shutil.rmtree(frontend_build_dir)
    packages_installed = subprocess.call(["npm", "install"])
    if packages_installed != 0:
        raise Exception(
            "please make sure npm is installed, otherwise view "
            "the above error for more info."
        )

    webpack_complete = subprocess.call(["npm", "run", "dev"])
    if webpack_complete != 0:
        raise Exception(
            "Webpack appears to have failed to build your "
            "frontend. See the above error for more information."
        )
    os.chdir(return_dir)

import os
import json
def load_data(data_dir):
    all_data = []
    for file in os.listdir(data_dir):
        full_path = os.path.join(data_dir, file)
        if not full_path.endswith('jsonl'):
            continue
        with open(full_path) as f:

            for line in f:
                all_data.append(json.loads(line))

    def clean_data(text):
        text = text.replace('{ vocalsound } ', '')
        text = text.replace('{ vocalsound }', '')
        text = text.replace('{ disfmarker } ', '')
        text = text.replace('{ disfmarker } ', '')
        text = text.replace('{disfmarker}', '')
        text = text.replace("{vocalsound}", '')
        text = text.replace('a_m_i_', 'ami')
        text = text.replace('l_c_d_', 'lcd')
        text = text.replace('p_m_s', 'pms')
        text = text.replace('t_v_', 'tv')
        text = text.replace('{ pause } ', '')
        text = text.replace('{pause}', '')
        text = text.replace('{ nonvocalsound } ', '')
        text = text.replace('{nonvocalsound}', '')
        text = text.replace('{ gap } ', '')
        text = text.replace('{gap}', '')
        return text

    data_mturk = []
    min_turns_per_segment = 2
    max_turns_per_segment = 7
    max_words_per_segment = 500
    min_words_per_segment = 200

    for item in all_data:
        turns = item['meeting_transcripts']
        turns_formatted = [turn['speaker'] + ': ' + clean_data(turn['content']) for turn in turns]
        # assert len(item['general_query_list']) == 1, item['general_query_list']
        overall_summ = item['general_query_list'][0]['answer']

        for topic_seg in item['topic_list']:
            topic = topic_seg['topic']
            for span in topic_seg['relevant_text_span']:
                start, end = int(span[0]), int(span[1])

                curr_segment, curr_word_cnt = [], 0
                for turn_idx in range(start, end + 1):
                    
                    single_turn = turns_formatted[turn_idx]

                    # skip empty turn
                    if len(single_turn.split(': ')[1].strip()) == 0:
                        continue

                    # exceed token limits or exceed turn limits
                    if (curr_word_cnt + len(single_turn.split()) > max_words_per_segment and len(curr_segment) >= min_turns_per_segment) \
                        or (len(curr_segment) + 1 > max_turns_per_segment and curr_word_cnt >= min_words_per_segment):
                        data_mturk.append(
                            {
                                'abstract': overall_summ,
                                'turns':  curr_segment,
                                'topic': topic
                            }
                        )

                        curr_segment = [single_turn]
                        curr_word_cnt = len(single_turn.split())
                        continue 
                    
                    curr_segment.append(single_turn)
                    curr_word_cnt += len(single_turn.split())

                if curr_segment:
                    data_mturk.append(
                        {
                            'abstract': overall_summ,
                            'turns':  curr_segment,
                            'topic': topic
                        }
                    )
    return data_mturk


@hydra.main(config_path="hydra_configs", config_name="scriptconfig")
def main(cfg: DictConfig) -> None:



    data_dir = cfg.mephisto.task.data_dir

    raw_data = load_data(data_dir)

    def onboarding_always_valid(onboarding_data):
        return onboarding_data['outputs']['answer'] == "1"

    # Bold the speaker name
    for item in raw_data:
       item['turns'] = ['<strong>' + turn.replace(':', ":</strong>")  for turn in item['turns'] ]

    shared_state = SharedStaticTaskState(
        static_task_data=raw_data[:200],
        validate_onboarding=onboarding_always_valid,
    )

    build_task(cfg.task_dir)

    db, cfg = load_db_and_process_config(cfg)
    operator = Operator(db)

    operator.validate_and_run_config(cfg.mephisto, shared_state)
    operator.wait_for_runs_then_shutdown(skip_input=True, log_rate=30)


if __name__ == "__main__":
    main()
