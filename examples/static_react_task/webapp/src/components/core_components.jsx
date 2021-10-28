/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from "react";

function OnboardingComponent({ onSubmit }) {
  return (
    <div>
      <Directions>
        This component only renders if you have chosen to assign an onboarding
        qualification for your task. Click the button to move on to the main
        task.
      </Directions>
      <button
        className="button is-link"
        onClick={() => onSubmit({ success: true })}
      >
        Move to main task.
      </button>
    </div>
  );
}

function LoadingScreen() {
  return <Directions>Loading...</Directions>;
}

function Directions({ children }) {
  return (
    <section className="hero is-light">
      <div className="hero-body">
        <div className="container">
          <p className="subtitle is-5">{children}</p>
        </div>
      </div>
    </section>
  );
}

function SimpleFrontend({ taskData, isOnboarding, onSubmit, onError }) {
  const [textValue, setTextValue] = React.useState("");
  if (!taskData) {
    return <LoadingScreen />;
  }
  if (isOnboarding) {
    return <OnboardingComponent onSubmit={onSubmit} />;
  }
  return (
    <div>
      <Directions>
        Directions: This task requires you to ask questions about a short section of a meeting transcript. Besides the section, you will also be shown the topics discussed in the meeting and overall summary. Make sure the question is answerable given the transcript section.
      </Directions>
      <section className="section">
        <div className="container">
          <p className="subtitle is-5"></p>
          <p className="subtitle is-3 is-spaced"><strong>Topics discussed:</strong> {taskData.topic}</p>


          <div class="columns">
            <div class="column is-one-thirds">
              <p className="subtitle is-3 is-spaced"><strong>Meeting summary:</strong></p>
              <div class="content">{taskData.abstract}</div>
            </div>


            <div class="column is-two-thirds">
              <p className="subtitle is-3 is-spaced"><strong>Meeting section:</strong></p>
              {taskData.turns.map(turn => (
                <div class="context" dangerouslySetInnerHTML={{ __html: turn }} />
              ))}

            </div>


          </div>
          <form>
          <div class="field">
            <label class="label">Question</label>
            <div class="control">
              <textarea class="textarea"
                placeholder="Type your question here."
                value={textValue}
                onChange={(event) => setTextValue(event.target.value)}
                // minLength={10}
                // maxLength={200}
                // required
              ></textarea>
            </div>
            
          </div>
          <button
            className="button is-success is-large"
            onClick={() =>  onSubmit({ question: textValue })}
            // disabled={}
          >
            Submit
          </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export { LoadingScreen, SimpleFrontend as BaseFrontend };
