const projects = [
    {
        id: 1,
        title: {
            en: "ERP System",
            fr: "Système ERP",
            ar: "نظام ERP"
        },
        category: {
            en: "Human Resources",
            fr: "Ressources humaines",
            ar: "الموارد البشرية"
        },
        video: "media/Videos/compressed/ERP.mp4",
        description: {
            en: "A fullstack human resource management web application built during my internship at Tunisia Smart Solutions, using Scrum and Laravel.",
            fr: "Une application web fullstack de gestion des ressources humaines développée lors de mon stage chez Tunisia Smart Solutions, en Scrum et Laravel.",
            ar: "تطبيق ويب متكامل لإدارة الموارد البشرية طُوّر خلال تربصي في Tunisia Smart Solutions باستخدام Scrum وLaravel."
        },
        tech: ["Laravel", "JavaScript", "MySQL", "HTML", "CSS"],
        features: {
            en: [
                "Dynamic role-based access control",
                "Multi-level validation workflows",
                "Real-time internal chat",
                "User management and authentication",
                "Responsive operations dashboard"
            ],
            fr: [
                "Contrôle d'accès dynamique par rôles",
                "Workflows de validation multi-niveaux",
                "Chat interne en temps réel",
                "Gestion des utilisateurs et authentification",
                "Tableau de bord opérationnel responsive"
            ],
            ar: [
                "تحكم ديناميكي في الوصول حسب الأدوار",
                "مسارات تحقق متعددة المستويات",
                "دردشة داخلية فورية",
                "إدارة المستخدمين والمصادقة",
                "لوحة تحكم تشغيلية متجاوبة"
            ]
        }
    },
    {
        id: 2,
        title: {
            en: "Sport Divers",
            fr: "Sport Divers",
            ar: "Sport Divers"
        },
        category: {
            en: "Sports Platform",
            fr: "Plateforme sportive",
            ar: "منصة رياضية"
        },
        video: "media/Videos/compressed/Sport Divers.mp4",
        description: {
            en: "A Laravel web application for managing a sports complex, developed during my internship at E-build.",
            fr: "Une application web Laravel pour la gestion d'un complexe sportif, développée lors de mon stage chez E-build.",
            ar: "تطبيق ويب بـ Laravel لإدارة مجمع رياضي، طُوّر خلال تربصي في E-build."
        },
        tech: ["Laravel", "JavaScript", "MySQL", "HTML", "CSS"],
        features: {
            en: [
                "Facility and booking management",
                "Event scheduling",
                "User profiles",
                "Operations dashboard",
                "Responsive interface"
            ],
            fr: [
                "Gestion des installations et des réservations",
                "Planification des événements",
                "Profils utilisateurs",
                "Tableau de bord opérationnel",
                "Interface responsive"
            ],
            ar: [
                "إدارة المرافق والحجوزات",
                "جدولة الأحداث",
                "ملفات المستخدمين",
                "لوحة تحكم تشغيلية",
                "واجهة متجاوبة"
            ]
        }
    },
    {
        id: 3,
        title: {
            en: "UniJob",
            fr: "UniJob",
            ar: "UniJob"
        },
        category: {
            en: "Job Portal",
            fr: "Portail d'emploi",
            ar: "بوابة وظائف"
        },
        video: "media/Videos/compressed/UniJob.mp4",
        description: {
            en: "A fullstack portal linking students and employers for internships and part-time work, built as a freelance project for an ISCAE students group.",
            fr: "Un portail fullstack reliant étudiants et employeurs pour les stages et jobs à temps partiel, réalisé en freelance pour un groupe d'étudiants de l'ISCAE.",
            ar: "بوابة متكاملة تربط الطلاب وأصحاب العمل للتدريب والعمل بدوام جزئي، طُوّرت كمشروع حر لمجموعة طلاب ISCAE."
        },
        tech: ["Laravel", "Vue.js", "SQLite", "Vite"],
        features: {
            en: [
                "Students browse jobs and apply with CVs",
                "Employers post jobs and manage applications",
                "Admin approval for profiles, users, jobs, and invoices",
                "Real-time chat and notifications",
                "PDF invoices and role-based access"
            ],
            fr: [
                "Les étudiants parcourent les offres et postulent avec leur CV",
                "Les employeurs publient des offres et gèrent les candidatures",
                "Validation admin des profils, utilisateurs, offres et factures",
                "Chat en temps réel et notifications",
                "Factures PDF et contrôle d'accès par rôles"
            ],
            ar: [
                "تصفح الطلاب للوظائف والتقديم بالسيرة الذاتية",
                "نشر أصحاب العمل للوظائف وإدارة الطلبات",
                "موافقة المشرف على الملفات والمستخدمين والوظائف والفواتير",
                "دردشة فورية وإشعارات",
                "فواتير PDF وتحكم في الوصول حسب الأدوار"
            ]
        }
    },
    {
        id: 4,
        title: {
            en: "J.A.R.V.I.S.",
            fr: "J.A.R.V.I.S.",
            ar: "J.A.R.V.I.S."
        },
        category: {
            en: "AI Voice Assistant",
            fr: "Assistant vocal IA",
            ar: "مساعد صوتي ذكي"
        },
        video: "media/Videos/compressed/jarvis.mp4",
        description: {
            en: "A fully local AI voice assistant in Python, using Faster-Whisper, Ollama (Qwen2.5), and Piper for speech recognition, conversation, and text-to-speech.",
            fr: "Un assistant vocal IA entièrement local en Python, utilisant Faster-Whisper, Ollama (Qwen2.5) et Piper pour la reconnaissance vocale, la conversation et la synthèse vocale.",
            ar: "مساعد صوتي ذكي يعمل محلياً بالكامل بلغة Python، يستخدم Faster-Whisper وOllama (Qwen2.5) وPiper للتعرف على الكلام والمحادثة وتحويل النص إلى صوت."
        },
        tech: ["Python", "Faster-Whisper", "Ollama", "Piper"],
        features: {
            en: [
                "Fully offline speech-to-text and text-to-speech",
                "Conversational AI with Qwen2.5 via Ollama",
                "Modular architecture for long-term memory",
                "Tool and function calling",
                "Local system task automation"
            ],
            fr: [
                "Reconnaissance et synthèse vocales 100% hors ligne",
                "IA conversationnelle Qwen2.5 via Ollama",
                "Architecture modulaire avec mémoire long terme",
                "Appel d'outils et de fonctions",
                "Automatisation de tâches système locales"
            ],
            ar: [
                "تعرف على الكلام وتحويل النص إلى صوت دون اتصال",
                "ذكاء محادثة Qwen2.5 عبر Ollama",
                "بنية معيارية تدعم الذاكرة طويلة المدى",
                "استدعاء الأدوات والوظائف",
                "أتمتة المهام على الجهاز المحلي"
            ]
        }
    },
    {
        id: 5,
        title: {
            en: "Green Exchange",
            fr: "Green Exchange",
            ar: "Green Exchange"
        },
        category: {
            en: "Sustainability Platform",
            fr: "Plateforme durable",
            ar: "منصة استدامة"
        },
        video: "media/Videos/compressed/Green Exchange.mp4",
        description: {
            en: "A fullstack marketplace for trading recyclable waste between buyers and sellers, built as a freelance project for an ISCAE students group.",
            fr: "Une marketplace fullstack pour l'échange de déchets recyclables entre acheteurs et vendeurs, réalisée en freelance pour un groupe d'étudiants de l'ISCAE.",
            ar: "سوق متكامل لتداول مواد النفايات القابلة لإعادة التدوير بين المشترين والبائعين، طُوّر كمشروع حر لمجموعة طلاب ISCAE."
        },
        tech: ["PHP", "SQLite", "HTML", "CSS", "JavaScript"],
        features: {
            en: [
                "Product listings, cart, and wishlist",
                "Order management with admin approval",
                "Commission tracking and PDF invoices",
                "Notifications and role-based access",
                "Multi-language support (EN / FR / AR)"
            ],
            fr: [
                "Annonces, panier et liste de souhaits",
                "Gestion des commandes avec validation admin",
                "Suivi des commissions et factures PDF",
                "Notifications et contrôle d'accès par rôles",
                "Support multilingue (EN / FR / AR)"
            ],
            ar: [
                "قوائم المنتجات والسلة وقائمة الرغبات",
                "إدارة الطلبات مع موافقة المشرف",
                "تتبع العمولات وفواتير PDF",
                "إشعارات وتحكم في الوصول حسب الأدوار",
                "دعم متعدد اللغات (إنجليزي / فرنسي / عربي)"
            ]
        }
    }
];
