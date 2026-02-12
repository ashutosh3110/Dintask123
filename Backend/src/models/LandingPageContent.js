const mongoose = require('mongoose');

const LandingPageContentSchema = new mongoose.Schema({
    hero: {
        badge: {
            type: String,
            default: "YOUR COMPLETE CRM PLATFORM"
        },
        title: {
            type: String,
            default: "Five powerful CRM modules to run your entire business."
        },
        subtitle: {
            type: String,
            default: "Access our Sales, Project Management, HR, Finance, and Client Portal modules—all integrated in one platform. Manage your entire business operations without switching between multiple tools. Get started today and transform how you work."
        },
        ctaPrimary: {
            type: String,
            default: "Get Started"
        },
        ctaSecondary: {
            type: String,
            default: "View Modules"
        }
    },
    platformSection: {
        badge: {
            type: String,
            default: "All-in-one suite"
        },
        title: {
            type: String,
            default: "DinTask One"
        },
        subtitle: {
            type: String,
            default: "The operating system for business."
        },
        description: {
            type: String,
            default: "Run your entire business on DinTask with our unified cloud software."
        },
        ctaText: {
            type: String,
            default: "TRY DINTASK ONE"
        },
        quote: {
            type: String,
            default: "DinTask One is a boon for all. It transformed our workflow."
        },
        authorName: {
            type: String,
            default: "Rishi Sir"
        },
        authorRole: {
            type: String,
            default: "Founder & CEO, DinTask"
        },
        authorImage: {
            type: String,
            default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rishi"
        }
    },
    faqs: {
        type: [{
            question: {
                type: String,
                required: true
            },
            answer: {
                type: String,
                required: true
            }
        }],
        default: [
            {
                question: "Can I customize the modules to fit my business needs?",
                answer: "Absolutely! DinTask is designed to be highly flexible. You can customize workflows, fields, and permissions across all modules—Sales, Projects, HR, and more—to align perfectly with your unique business processes."
            },
            {
                question: "How do I add team members to the platform?",
                answer: "Adding your team is simple. As an admin, navigate to the 'Employee Management' section in your dashboard, click 'Add Employee', and enter their details. They'll receive an email with login credentials instantly."
            },
            {
                question: "What kind of support do you provide?",
                answer: "We offer comprehensive support including 24/7 live chat, detailed documentation, video tutorials, and dedicated account managers for enterprise plans to ensure you get the most out of DinTask."
            }
        ]
    },
    tacticalSection: {
        title: {
            type: String,
            default: "The Tactical Interface."
        },
        subtitle: {
            type: String,
            default: "Tactical Preview"
        },
        images: {
            type: [String],
            default: [
                "https://res.cloudinary.com/djaq2196e/image/upload/v1707560001/dashboard_1_placeholder.png",
                "https://res.cloudinary.com/djaq2196e/image/upload/v1707560002/dashboard_2_placeholder.png",
                "https://res.cloudinary.com/djaq2196e/image/upload/v1707560003/dashboard_3_placeholder.png"
            ]
        }
    },
    footerCta: {
        title: {
            type: String,
            default: "Ready to experience the Command Center?"
        },
        description: {
            type: String,
            default: "Join thousands of managers who have optimized their workforce with DinTask's integrated suite."
        },
        ctaPrimary: {
            type: String,
            default: "START FREE TRIAL"
        },
        ctaSecondary: {
            type: String,
            default: "BOOK A DEMO"
        },
        images: {
            type: [String],
            default: []
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('LandingPageContent', LandingPageContentSchema);
