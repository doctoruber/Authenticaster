import React from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import Navbar from './NavBar'; 

const Container = styled.div`
  text-align: center;
  padding: 50px;
  color: white;
  background-color: #000; 
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Question = styled(animated.h3)`
  margin: 20px 0;
`;

const Answer = styled(animated.p)`
  color: #bbb;
  max-width: 600px;
`;

const About = () => {
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  const faqs = [
    { question: 'Who are we? What is authenticaster?', answer: 'We are a team dedicated to bringing you the best ZKP tools. Authenticaster is a service that tells you the reliability score of any post in the launchcaster service.' },
    { question: 'What do the reliability scores mean?', answer: '0-20%: The post lacks credibility and has minimal attention. Proceed with extreme caution. Or perhaps the link is not a valid link. 21-40%: The post has low credibility and limited interest. Proceed with caution. 41-60%: The credibility is moderate, but proceed with caution. 61-80%: The post demonstrates high credibility, but further observation is recommended. 81-100%: The post exhibits the highest level of credibility, but due diligence is still advised. ' },
    

  ];

  return (
    <>
      <Navbar />
      <Container>
        {faqs.map((faq, index) => (
          <div key={index}>
            <Question style={fade}>{faq.question}</Question>
            <Answer style={fade}>{faq.answer}</Answer>
          </div>
        ))}
      </Container>
    </>
  );
};

export default About;
