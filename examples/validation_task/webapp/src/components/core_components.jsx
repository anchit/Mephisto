/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from "react";

function OnboardingComponent({ onSubmit }) {
  const [q1Value, setQ1Value] = React.useState("");
  const [q2Value, setQ2Value] = React.useState("");
  const [q3Value, setQ3Value] = React.useState("");
  const [isTime, setIsTimeValue] = React.useState(true);
  setTimeout(() => setIsTimeValue(false), 25000); // 15s
  return (
    <div>
      <Directions>
      <div class="content">
      <p className="subtitle"><strong>Onboarding Guidelines:</strong></p>
      <ul>
        <li>This task requires you to rate the quality of a question, answer pair about a short section of a meeting.</li>
        <li>Imagine you are trying to find useful information about certain topics from the meeting through Q&A</li>
        <li>First evaluate if the question is related to the meeting section and is asking for useful information</li>
        <li>Then check if the provided answer to the question is correct</li>
      </ul>
      </div>
      </Directions>

      
      <div className="container">
        <section class="mt-2">
          <p className="subtitle is-5"></p>
          <p className="subtitle is-4 is-spaced"><strong>Topics discussed: </strong>Remote control prototype design and key features</p>
          <div class="columns">
            <div class="column is-two-thirds">
              <p className="subtitle is-4 is-spaced"><strong>Meeting section:</strong></p>
                <div class="context"><strong>Project Manager:</strong> Show it to us</div>
                <div class="context"><strong>Industrial Designer:</strong> There you go . </div>
                <div class="context"><strong>User Interface:</strong> It's you know it's flimsy 'cause it's made out of heavy Play-Doh ,</div>
                <div class="context"><strong>Marketing:</strong> Pretty impressive .</div>
                <div class="context"><strong>Project Manager:</strong> Well done .</div>
            </div>
          </div>
          </section>


        <div class="is-divider" data-content="Examples"></div>
        

        <div class="columns">

        
        <div class="column is-half">
          <p className="subtitle is-4 is-spaced">Example <strong><font color="green">GOOD</font></strong> Question from the meeting segment</p>
          <div class="context"><strong>Question:</strong> What was the remote prototype made of? <strong>Answer:</strong> Play-Doh </div>
          <div class="context"><strong>Explanation:</strong> The "remote prototype" is an important topic of the meeting.</div>     
        </div>
        <div class="column is-half">
          <p className="subtitle is-4 is-spaced">Example <strong><font color="red">BAD</font></strong> Questions from the meeting segment</p>
          <div class="context"><strong>Question:</strong> Who said “Pretty impressive”? <strong>Answer:</strong> Marketing</div>
          <div class="context"><strong>Explanation:</strong> The speaker of some vague phrase is not useful for the team. </div>     
        </div>
        </div>

        <div class="is-divider" data-content="Test your understanding to proceed"></div>
        <p className="subtitle is-4 is-spaced"><strong>Try your best to rate the following QA pairs about the meeting</strong></p>
        <section class="mt-2">
          <span className="subtitle is-4 is-spaced">Q: Is the content technical? A: Yes </span>
          <div onChange={(event) => setQ2Value(event.target.value)}>
            <div><input type="radio" value="0" name="q2" />The question is not meaningful</div>
            <div><input type="radio" value="1" name="q2" />The question is meaningful but the answer is wrong</div>
            <div><input type="radio" value="2" name="q2" />The question is meaningful and the answer is correct</div>
          </div>
        </section> 
        <section class="mt-4">
          <span className="subtitle is-4 is-spaced">Q: Why was the remote prototype heavy? A: cause it's made out of heavy Play-Doh </span>
          <div onChange={(event) => setQ1Value(event.target.value)}>
            <div><input type="radio" value="0" name="q1" />The question is not meaningful</div>
            <div><input type="radio" value="1" name="q1" />The question is meaningful but the answer is wrong</div>
            <div><input type="radio" value="2" name="q1" />The question is meaningful and the answer is correct</div>
          </div>
        </section>  
        <section class="mt-4">
          <span className="subtitle is-4 is-spaced">Q: What color is the remote? A: Play-Doh </span>
          <div onChange={(event) => setQ3Value(event.target.value)}>
            <div><input type="radio" value="0" name="q3" />The question is not meaningful</div>
            <div><input type="radio" value="1" name="q3" />The question is meaningful but the answer is wrong</div>
            <div><input type="radio" value="2" name="q3" />The question is meaningful and the answer is correct</div>
          </div>
          <button
        className="button is-link"
        onClick={() => onSubmit({ answer: [q1Value, q2Value, q3Value] })}
        disabled={isTime||q1Value==""||q2Value==""||q3Value==""}
      >
        Submit
      </button>
        </section>      
        </div> 

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
  const [isTime, setIsTimeValue] = React.useState(true);
  setTimeout(() => setIsTimeValue(false), 60000); // 45s

  if (!taskData) {
    return <LoadingScreen />;
  }
  if (isOnboarding) {
    return <OnboardingComponent onSubmit={onSubmit} />;
  }
  return (
    <div>
      <Directions>
      <div><strong>Instructions:</strong></div>This task requires you to ask rate question, answers about a section of a meeting transcript. Besides the section, you will also be shown the topic discussed in the meeting.

      <div class="content">
      <br /> 
      <p className="subtitle"><strong>Tips to not get work <font color="red">rejected</font>:</strong></p>
      <ul>
        <li>Read the section first to understand the context</li>
        <li>Imagine you are trying to find useful information from certain topics in the meeting.</li>
        <li>Rate the quality of the question and check if the answer is correct</li>
      </ul>
      </div>
      </Directions>
      <section class="mt-2">
        <div className="container">
          <p className="subtitle is-4 is-spaced"><strong>Topic discussed:</strong> {taskData.topic}</p>
          <div class="columns">
            <div class="column is-two-thirds">
              <p className="subtitle is-4 is-spaced"><strong>Meeting section:</strong></p>
              {taskData.turns.map(turn => (
                <div class="context" dangerouslySetInnerHTML={{ __html: turn.replace(taskData.answer,'<span class="has-text-black has-background-grey-lighter">'+taskData.answer+'</span>') }} />
              ))}
            </div>
          </div>
          <div class='is-size-4'>
          <strong>Question: </strong> {taskData.question}
          </div>
          <div class='is-size-4'>
          <strong>Answer: </strong> {taskData.answer}
          </div>
          <section class="mt-1">
          <div onChange={(event) => setTextValue(event.target.value)}>
            <div class='is-size-5'><input type="radio" value="0" name="rating" />The question is not meaningful</div>
            <div class='is-size-5'><input type="radio" value="1" name="rating" />The question is meaningful but the answer is wrong</div>
            <div class='is-size-5'><input type="radio" value="2" name="rating" />The question is meaningful and the answer is correct</div>
          </div>
          </section>
          <button
            className="button is-success is-large"
            onClick={() =>  onSubmit({ rating: textValue})}
            disabled={isTime||textValue==""}
          >
            Submit
          </button>
        </div>
      </section>
    </div>
  );
}

export { LoadingScreen, SimpleFrontend as BaseFrontend };
