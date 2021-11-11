/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from "react";

function OnboardingComponent({ onSubmit }) {
  const [textValue, setTextValue] = React.useState("");
  const [isTime, setIsTimeValue] = React.useState(true);
  setTimeout(() => setIsTimeValue(false), 15000); // 15s
  return (
    <div>

      
      <Directions>
      <p className="subtitle"><strong>This task is about Q&A over meetings. </strong></p>

      <div class="content">

      <strong>Onboarding task instruction:</strong> This task requires you to ask questions about a short section of a meeting transcript. Apart from the section, you will also be given some general information about the meeting: the topics discussed in the meeting and the overall summary. <br /> Here is an example: please read the whole thing to avoid failing the qualification test.

      </div>

      </Directions>

      
      <div className="container">
        <section className="section">
          <p className="subtitle is-5"></p>
          <p className="subtitle is-4 is-spaced"><strong>Topics discussed: </strong>Remote control prototype introduction</p>
          <div class="columns">
            <div class="column is-half">
              <p className="subtitle is-4 is-spaced"><strong>Meeting summary:</strong></p>
              <div class="content"><blockquote>The Project Manager reviewed the overall process for remote control design and key features. After that, User Interface introduced the prototype. The prototype was yellow like a banana with a simple quick on-off button.</blockquote></div>
            </div>
            <div class="column is-half">
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
          <div class="context"><strong>What was the remote prototype made of?</strong></div>
          <div class="context">This question takes in context from the summary i.e is asking about the remote prototype and the answer to this “Play-Doh” is present in the meeting segment</div>     
        </div>
        <div class="column is-half">
          <p className="subtitle is-4 is-spaced">Example <strong><font color="red">BAD</font></strong> Questions from the meeting segment</p>
          <div class="context"><strong>Who said “Pretty impressive”?</strong></div>
          <div class="context">We are looking for meaningful questions and not directly based on quotes from the meeting</div>  
          <div class="context"><strong>What color was the prototype?</strong></div>
          <div class="context">This question is not answerable from the meeting segment and needs extra information</div>    
        </div>
        </div>

        <div class="is-divider" data-content="Examples"></div>
        <div>
          <p className="subtitle is-4">Based on the instructions which of the following is the best question to ask?</p>
          <div onChange={(event) => setTextValue(event.target.value)}>
            <div><input type="radio" value="0" name="answer" /> Who said “Well done”?</div>
            <div><input type="radio" value="1" name="answer" /> Why was the remote prototype heavy?</div>
            <div><input type="radio" value="2" name="answer" /> What device is the remote for?</div>
            <div><input type="radio" value="3" name="answer" /> What color is the remote?</div>
          </div>
          <button
        className="button is-link"
        onClick={() => onSubmit({ answer: textValue })}
        disabled={isTime||textValue==""}
      >
        Submit Answer to proceed
      </button>
        </div>      
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
  setTimeout(() => setIsTimeValue(false), 15000); // 5s

  if (!taskData) {
    return <LoadingScreen />;
  }
  if (isOnboarding) {
    return <OnboardingComponent onSubmit={onSubmit} />;
  }
  return (
    <div>
      <Directions>
      <div><strong>Instructions:</strong></div>This task requires you to ask <strong>meaningful</strong> questions about a short section of a meeting transcript. Besides the section, you will also be shown the topics discussed in the meeting and overall summary. Make sure the question is answerable given the transcript section.


      <div class="content">
      <br /> 
      <p className="subtitle"><strong>Tips to succeed the task:</strong></p>

      <ul>
        <li>Avoid trivial and un-informative questions.</li>
        <li>Imagine you are trying to find useful information from certain topics in the meeting.</li>
        <li>Make sure the answer is obvious from the meeting segment, <strong>NOT</strong> the summary.</li>
      </ul>
      </div>

      </Directions>
      <section className="section">
        <div className="container">
          <p className="subtitle is-5"></p>
          <p className="subtitle is-3 is-spaced"><strong>Topics discussed:</strong> {taskData.topic}</p>


          <div class="columns">
            <div class="column is-half">
            
              <p className="subtitle is-3 is-spaced"><strong>Meeting summary:</strong></p>
              <div class="content"><blockquote>{taskData.abstract}</blockquote></div>
              
            </div>


            <div class="column is-half">
              <p className="subtitle is-3 is-spaced"><strong>Meeting section:</strong></p>
              {taskData.turns.map(turn => (
                <div class="context" dangerouslySetInnerHTML={{ __html: turn }} />
              ))}

            </div>
          </div>
          <div class="field">
            <label class="label">Question</label>
            <div class="control">
              <textarea class="textarea"
                placeholder="Type your question here."
                value={textValue}
                onChange={(event) => setTextValue(event.target.value)}
              ></textarea>
            </div>        
          </div>
          <button
            className="button is-success is-large"
            onClick={() =>  onSubmit({ question: textValue })}
            disabled={isTime||textValue.length<10}
          >
            Submit
          </button>
        </div>
      </section>
    </div>
  );
}

export { LoadingScreen, SimpleFrontend as BaseFrontend };
