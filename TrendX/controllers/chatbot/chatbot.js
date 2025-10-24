// controllers/chatbot/chatbot.js

const websiteInfo = (req, res) => {
    const websiteInfo = {
      name: "TrendX",
      question:"How can I help you?",
      description: "TrendX aims to  suppor creativity , promote sustaunable commerece ,and empower small business globally .",
      features: [
        "Feature 1: Description",
        "Feature 2: Description",
        "Feature 3: Description"
      ],
      contact: {
        email: "trendx.ecommerce24@gmail.com",
        phone: "+201030419960"
      }
    };
  
    res.json(websiteInfo);
  };
  const suggestedQuestions = (req, res) => {
    const questions = [
        {
          section: "User Login and Registration",
          items: [
            { question: "How do I create an account?", answer: "You can create an account by visiting the registration page and providing the necessary personal information, including your name, email, and password." },
            { question: "I forgot my password, what should I do?", answer: "Click on the 'Forgot Password' link on the login page, and follow the instructions to reset your password using your registered email address." }
          ]
        },
        {
          section: "Account Management",
          items: [
            { question: "How can I change my email address?", answer: "Navigate to your account settings, where you can edit your personal information, including your email address. Don't forget to save your changes." },
            { question: "How do I update my shipping address?", answer: "In the account settings, select the option to edit your shipping address, make the necessary changes, and save them for future orders." }
          ]
        },
        {
          section: "Contact Support",
          items: [
            { question: "How can I contact customer support?", answer: "via email 'trendx.ecommerce24@gmail.com' send the support request form with your inquiry or issue, and send it. Our team will get back to you as soon as possible." }
          ]
        },
        {
          section: "Browsing Products",
          items: [
            { question: "How do I find products on sale?", answer: "On our homepage or product listing page, you can navigate through different categories or use the search functionality to find products currently on sale." },
            { question: "Can I save items for later?", answer: "Yes, you can add items to your wishlist for future reference by selecting the option to add to wishlist on the product's detail page." }
          ]
        },
        {
          section: "Shopping Cart and Checkout",
          items: [
            { question: "How do I add items to my shopping cart?", answer: "Select the products and quantities you wish to purchase and click the 'Add to Cart' button. Your items will be added to your shopping cart." },
            { question: "What payment methods do you accept?", answer: "Currently, we accept cash on delivery for purchases. We are working on adding more payment options soon." }
          ]
        },
        {
          section: "Order Management",
          items: [
            { question: "How can I track my order?", answer: "Go to your order history section to view the status of your order, including current updates like 'Processing', 'Shipped', and 'Delivered'." }
          ]
        },
        {
          section: "Reviews and Feedback",
          items: [
            { question: "How do I leave a review for a product I purchased?", answer: "Navigate to the orders's  section, write your review, rate the product, and submit. Your feedback helps others make informed decisions." }
          ]
        },

        {
          section: "Managing Products (For Sellers)",
          items: [
            { question: "How do I add a new product to my store?", answer: "Access the product management section, select the option to add a new product, and provide the required information, including title, description, and price." }
          ]
        }
      ];
  
    res.json(questions);
  };
  module.exports = {
    websiteInfo,
    suggestedQuestions
  };  