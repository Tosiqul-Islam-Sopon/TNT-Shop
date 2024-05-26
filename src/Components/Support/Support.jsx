import { useState } from "react";
import ChatBot from "react-chatbotify";

const Support = () => {
  const [pack, setPack] = useState({});
  const ecommerceQuestions = [
    { question: "How do I track my order?", answer: "You can track your order by logging into your account and visiting the 'Orders' section." },
    { question: "What is your return policy?", answer: "Our return policy allows you to return items within 30 days of receipt. Please visit our returns page for more details." },
    { question: "How can I contact customer support?", answer: "You can contact our customer support via email at support@example.com or call us at (123) 456-7890." },
    { question: "Do you offer international shipping?", answer: "Yes, we offer international shipping to many countries. Please check our shipping policy page for more details." },
    { question: "How do I reset my password?", answer: "To reset your password, click on 'Forgot Password' at the login page and follow the instructions." },
    { question: "Can I change or cancel my order?", answer: "You can change or cancel your order within 24 hours of placing it. Please contact our customer support for assistance." },
    { question: "What payment methods do you accept?", answer: "We accept various payment methods including credit/debit cards, PayPal, and Apple Pay." },
    { question: "How do I apply a discount code?", answer: "You can apply a discount code at checkout. Simply enter the code in the 'Discount Code' field and click 'Apply'." },
    { question: "Where is my order confirmation email?", answer: "Your order confirmation email should arrive shortly after your purchase. If you don't see it, please check your spam/junk folder." },
    { question: "How do I update my shipping address?", answer: "You can update your shipping address in the 'Account Settings' section of your profile." },
    { question: "Why was my payment declined?", answer: "Payments can be declined for various reasons. Please ensure your card details are correct and contact your bank if the issue persists." },
    { question: "How do I leave a review for a product?", answer: "To leave a review, go to the product page and click on 'Write a Review'. You must be logged in to submit a review." },
    { question: "Do you offer gift wrapping?", answer: "Yes, we offer gift wrapping services for an additional fee. You can select this option at checkout." },
    { question: "Can I use multiple discount codes?", answer: "No, only one discount code can be applied per order." },
    { question: "How do I know if an item is in stock?", answer: "The product page will indicate whether an item is in stock or out of stock." },
    { question: "What do I do if I receive a damaged item?", answer: "If you receive a damaged item, please contact our customer support within 7 days of receiving your order." },
    { question: "How long does shipping take?", answer: "Shipping times vary depending on your location. Please refer to our shipping policy page for estimated delivery times." },
    { question: "Can I pre-order items?", answer: "Yes, we offer pre-orders for certain items. These items will be clearly marked on the product page." },
    { question: "What is your privacy policy?", answer: "Our privacy policy can be viewed on our website. We are committed to protecting your personal information." },
    { question: "Do you offer a loyalty program?", answer: "Yes, we offer a loyalty program where you can earn points for purchases and redeem them for discounts on future orders." },
    { question: "How do I create an account?", answer: "To create an account, click on the 'Sign Up' button at the top of our website and fill in the required information." },
    { question: "Can I place an order over the phone?", answer: "Yes, you can place an order over the phone by calling our customer support during business hours." },
    { question: "What happens if an item is out of stock?", answer: "If an item is out of stock, you can sign up to be notified when it becomes available again." },

    { question: "Do you offer expedited shipping?", answer: "Yes, we offer expedited shipping options at checkout for an additional fee." },
    { question: "Can I ship items to multiple addresses?", answer: "No, you will need to place separate orders for each shipping address." },
    { question: "How do I change my email preferences?", answer: "You can change your email preferences in the 'Account Settings' section of your profile." }
  ];

  const findMostSimilarQuestion = (input) => {
    const inputLower = input.toLowerCase();
    let mostSimilar = ecommerceQuestions[0];
    let highestSimilarity = 0;

    ecommerceQuestions.forEach(item => {
      let similarity = item.question.toLowerCase().split(' ').filter(word => inputLower.includes(word)).length;
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilar = item;
      }
    });

    return mostSimilar;
  };

  const flow = {
    start: {
      message: "Hello, welcome to our e-commerce website! What's your name?",
      transition: { duration: 0 },
      path: "ask_name"
    },
    ask_name: {
      message: "Can you please tell me your name?",
      path: async (params) => {
        await params.injectMessage("Nice to meet you, " + params.userInput + "! How can I help you today?");
        return "ask_question";
      }
    },
    ask_question: {
      message: "Please ask any question related to our services.",
      path: async (params) => {
        const userInput = params.userInput;
        const mostSimilar = findMostSimilarQuestion(userInput);
        await params.injectMessage("Did you mean: \"" + mostSimilar.question + "\"?");
        // params.session.set(mostSimilar);
        setPack(mostSimilar);
        return "confirm_question";
      }
    },
    confirm_question: {
      message: "Please confirm, is this your question? (Yes/No)",
      path: async (params) => {
        const mostSimilar = pack;
        if (params.userInput.toLowerCase() === "yes") {
          await params.injectMessage(mostSimilar.answer);
          return "prompt_again";
        } else {
          await params.injectMessage("Sorry, please ask your question again.");
          return "ask_question";
        }
      }
    },
    prompt_again: {
      message: "Do you need any other help? (Yes/No)",
      path: async (params) => {
        if (params.userInput.toLowerCase() === "yes") {
          return "ask_question";
        } else {
          await params.injectMessage("Thank you for visiting our website! Have a great day!");
          return null;
        }
      }
    }
  };

  return (
    <ChatBot options={{ theme: { embedded: false }, chatHistory: { storageKey: "example_faq_bot" } }} flow={flow} />
  );
};

export default Support;
