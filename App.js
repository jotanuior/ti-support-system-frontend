import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [supportDetails, setSupportDetails] = useState({ name: '', email: '', issue: '' });

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + '/questions')
      .then(response => setQuestions(response.data));
  }, []);

  const askQuestion = () => {
    axios.post(process.env.REACT_APP_BACKEND_URL + '/ask', { question: newQuestion })
      .then(response => setQuestions([...questions, response.data]));
  };

  const answerQuestion = (questionId) => {
    axios.post(process.env.REACT_APP_BACKEND_URL + '/answer', { questionId, answer: newAnswer })
      .then(response => {
        const updatedQuestions = questions.map(q => 
          q._id === response.data._id ? response.data : q
        );
        setQuestions(updatedQuestions);
      });
  };

  const voteAnswer = (questionId, answerId, vote) => {
    axios.post(process.env.REACT_APP_BACKEND_URL + '/vote', { questionId, answerId, vote })
      .then(response => {
        const updatedQuestions = questions.map(q => 
          q._id === response.data._id ? response.data : q
        );
        setQuestions(updatedQuestions);
      });
  };

  const contactSupport = () => {
    axios.post(process.env.REACT_APP_BACKEND_URL + '/contact-support', supportDetails)
      .then(() => alert('Support request submitted!'))
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <h1>TI Support System</h1>
      <textarea 
        value={newQuestion} 
        onChange={(e) => setNewQuestion(e.target.value)} 
        placeholder="Ask a new question..." 
      />
      <button onClick={askQuestion}>Ask</button>

      <div>
        {questions.map(question => (
          <div key={question._id}>
            <h2>{question.question}</h2>
            {question.answers.map(answer => (
              <div key={answer._id}>
                <p>{answer.text}</p>
                <button onClick={() => voteAnswer(question._id, answer._id, 1)}>Upvote</button>
                <button onClick={() => voteAnswer(question._id, answer._id, -1)}>Downvote</button>
                <p>Votes: {answer.votes}</p>
              </div>
            ))}
            <textarea 
              value={newAnswer} 
              onChange={(e) => setNewAnswer(e.target.value)} 
              placeholder="Add an answer..." 
            />
            <button onClick={() => answerQuestion(question._id)}>Answer</button>
          </div>
        ))}
      </div>

      <h2>Contact Support</h2>
      <input 
        type="text" 
        value={supportDetails.name} 
        onChange={(e) => setSupportDetails({ ...supportDetails, name: e.target.value })} 
        placeholder="Your Name" 
      />
      <input 
        type="email" 
        value={supportDetails.email} 
        onChange={(e) => setSupportDetails({ ...supportDetails, email: e.target.value })} 
        placeholder="Your Email" 
      />
      <textarea 
        value={supportDetails.issue} 
        onChange={(e) => setSupportDetails({ ...supportDetails, issue: e.target.value })} 
        placeholder="Describe your issue..." 
      />
      <button onClick={contactSupport}>Submit</button>
    </div>
  );
}

export default App;
