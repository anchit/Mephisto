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
from glob import iglob

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
    data_mturk = []
    file_list = [f for f in iglob(data_dir, recursive=True) if os.path.isfile(f) and 'onboarding' not in f]
    for f in file_list:
        data = json.load(open(f,'r'))
        if data['outputs'] is not None:
            data_mturk.append(
                {
                    'abstract': data['inputs']['abstract'],
                    'turns':  data['inputs']['turns'],
                    'topic': data['inputs']['topic'],
                    'section': data['inputs']['section'],
                    'question': data['outputs']['final_data']['question'],
                    'answer': data['outputs']['final_data']['answer']
                }
            )
    return data_mturk


@hydra.main(config_path="hydra_configs", config_name="scriptconfig")
def main(cfg: DictConfig) -> None:


    data_dir = cfg.mephisto.task.data_dir

    raw_data = load_data(data_dir)

    def onboarding_always_valid(onboarding_data):
        print(onboarding_data['outputs']['answer'])
        return onboarding_data['outputs']['answer'] == ['2', '0', '1']

    shared_state = SharedStaticTaskState(
        static_task_data=raw_data[:5],
        validate_onboarding=onboarding_always_valid,
    )

    build_task(cfg.task_dir)

    db, cfg = load_db_and_process_config(cfg)
    operator = Operator(db)

    operator.validate_and_run_config(cfg.mephisto, shared_state)
    operator.wait_for_runs_then_shutdown(skip_input=True, log_rate=30)


if __name__ == "__main__":
    main()
