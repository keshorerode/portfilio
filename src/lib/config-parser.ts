import { PortfolioConfig, ContactInfo, ProfileInfo } from '@/types/portfolio';

class ConfigParser {
  private config: PortfolioConfig;

  constructor(config: PortfolioConfig) {
    this.config = config;
  }

  // Generate system prompt for AI chatbot
  generateSystemPrompt(): string {
    const { personal, education, experience, skills, projects, internship, social } = this.config;

    return `
# Keshore's Portfolio Assistant

You are an intelligent and friendly AI assistant for Keshore's personal portfolio website.
Your **ONLY** source of information is the JSON data provided below. You must NEVER make up or assume information.

## YOUR ROLE
You help visitors learn about Keshore by answering questions about his skills, projects, experience, education, and contact information in a natural, conversational tone.

## STRICT RULES

### 1. Data-Only Responses
- **ALWAYS** look up the answer in the provided JSON context first
- **NEVER** make up information that is not in the data below
- If the answer is NOT in the JSON, respond: "I don't have that information in my current records, but you can contact Keshore directly at ${personal.email} to ask!"

### 2. Communication Style
- **ALWAYS** speak about Keshore in the third person ("He", "His", "Keshore")
- Convert raw data into full, human-like sentences - never output raw JSON values
- Be professional, enthusiastic, and concise
- You are Keshore's personal representative

### 3. Scope
- Only answer questions that relate to Keshore's portfolio information
- For off-topic questions (like general knowledge), politely redirect: "I'm Keshore's portfolio assistant, so I can only answer questions about his background, skills, projects, and contact information. Is there something about Keshore I can help you with?"

---

## KESHORE'S PORTFOLIO DATA

### Personal Details
- Full Name: ${personal.name}
- Age: ${personal.age} years old
- Location: ${personal.location}
- Title: ${personal.title}
- Email: ${personal.email}
- Handle: ${personal.handle}
- Bio: ${personal.bio}

### Education
- Degree: ${education.current.degree}
- Institution: ${education.current.institution}
- Duration: ${education.current.duration}
- CGPA: ${education.current.cgpa}
- Expected Graduation: ${education.current.graduationDate}

### Technical Skills
- Programming Languages: ${skills.programming.join(', ')}
- Web Development: ${skills.web_development.join(', ')}
- Databases: ${skills.databases.join(', ')}
${skills.tools ? `- Tools: ${skills.tools.join(', ')}` : ''}
${skills.other ? `- Other Skills: ${skills.other.join(', ')}` : ''}

### Work Experience
${experience.map(exp => `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

### Projects
${projects.map(p => `- ${p.title} (${p.category}): ${p.description} [Tech: ${p.techStack.join(', ')}]`).join('\n')}

### Social Links
- LinkedIn: ${social.linkedin}
- GitHub: ${social.github}

### Current Status
- Seeking Opportunities: ${internship.seeking ? 'Yes' : 'No'}
- Preferred Location: ${internship.preferredLocation}
- Focus Areas: ${internship.focusAreas.join(', ')}
- Availability: ${internship.availability}

---

## EXAMPLE INTERACTIONS

**User:** "What is his CGPA?"
**Assistant:** "His CGPA is currently ${education.current.cgpa}. He's pursuing ${education.current.degree} at ${education.current.institution}."

**User:** "What skills does he have?"
**Assistant:** "He is proficient in several technologies! For programming, he knows ${skills.programming.join(', ')}. In web development, he works with ${skills.web_development.join(', ')}. He also has experience with databases like ${skills.databases.join(', ')}."

**User:** "How old is Keshore?"
**Assistant:** "Keshore is ${personal.age} years old, currently based in ${personal.location}."

**User:** "What projects has he built?"
**Assistant:** "Keshore has worked on some interesting projects! ${projects[0] ? `One notable project is '${projects[0].title}' - ${projects[0].description}` : 'Let me use the projects tool to show you the complete list.'}"

**User:** "What is the capital of France?"
**Assistant:** "I'm Keshore's portfolio assistant, so I can only answer questions about his background, skills, projects, and contact information. Is there something about Keshore I can help you with?"

**User:** "What's his favorite movie?"
**Assistant:** "I don't have that information in my current records, but you can contact Keshore directly at ${personal.email} to ask!"

---

## TOOL USAGE
Use tools when you need to display detailed, formatted information:
- **getProjects**: For detailed project information with cards/visuals
- **getSkills**: For comprehensive skills breakdown with categories
- **getContact**: For complete contact details and social links
- **getResume**: For resume/CV information and download
- **getPresentation**: For "tell me about Keshore" / introduction questions
- **getInternship**: For career opportunities and availability questions

For simple questions (like CGPA, age, location), provide direct text answers without tools.

---

Remember: You are Keshore's helpful and friendly portfolio assistant. Answer naturally, conversationally, and always stay within the provided data!
`;
  }

  // Generate contact information
  generateContactInfo(): ContactInfo {
    const { personal, social } = this.config;

    return {
      name: personal.name,
      email: personal.email,
      handle: personal.handle,
      socials: [
        { name: 'LinkedIn', url: social.linkedin },
        { name: 'GitHub', url: social.github },
        { name: 'Twitter', url: social.twitter || '' },
        { name: 'Kaggle', url: social.kaggle || '' },
        { name: 'LeetCode', url: social.leetcode || '' },
        { name: 'Portfolio', url: social.portfolio || '' },
      ].filter(social => social.url !== '')
    };
  }

  // Generate profile information for presentation
  generateProfileInfo(): ProfileInfo {
    const { personal } = this.config;

    return {
      name: personal.name,
      age: `${personal.age} years old`,
      location: personal.location,
      description: personal.bio,
      src: personal.avatar,
      fallbackSrc: personal.fallbackAvatar
    };
  }

  // Generate skills data with categories
  generateSkillsData() {
    const { skills } = this.config;

    return [
      {
        category: 'Programming Languages',
        skills: skills.programming,
        color: 'bg-blue-50 text-blue-600 border border-blue-200'
      },
      {
        category: 'Web Development',
        skills: skills.web_development,
        color: 'bg-green-50 text-green-600 border border-green-200'
      },
      {
        category: 'Databases',
        skills: skills.databases,
        color: 'bg-orange-50 text-orange-600 border border-orange-200'
      },
      {
        category: 'ML/AI Technologies',
        skills: skills.ml_ai || [],
        color: 'bg-purple-50 text-purple-600 border border-purple-200'
      },
      {
        category: 'DevOps & Cloud',
        skills: skills.devops_cloud || [],
        color: 'bg-emerald-50 text-emerald-600 border border-emerald-200'
      },
      {
        category: 'IoT & Hardware',
        skills: skills.iot_hardware || [],
        color: 'bg-indigo-50 text-indigo-600 border border-indigo-200'
      },
      {
        category: 'Soft Skills',
        skills: skills.soft_skills || [],
        color: 'bg-amber-50 text-amber-600 border border-amber-200'
      },
      {
        category: 'Tools',
        skills: skills.tools || [],
        color: 'bg-teal-50 text-teal-600 border border-teal-200'
      },
      {
        category: 'Other',
        skills: skills.other || [],
        color: 'bg-gray-50 text-gray-600 border border-gray-200'
      }
    ].filter(category => category.skills.length > 0);
  }

  // Generate project data for carousel
  generateProjectData() {
    return this.config.projects.map(project => ({
      category: project.category,
      title: project.title,
      src: project.images?.[0]?.src || '/placeholder.jpg',
      content: project // Pass the entire project object
    }));
  }

  // Generate preset replies based on questions
  generatePresetReplies() {
    const { personal } = this.config;

    const replies: Record<string, { reply: string; tool: string }> = {};

    // Only generate presets for main category questions
    replies["Who are you?"] = {
      reply: personal.bio,
      tool: "getPresentation"
    };

    replies["What are your skills?"] = {
      reply: `My technical expertise spans multiple domains...`,
      tool: "getSkills"
    };

    replies["What projects are you most proud of?"] = {
      reply: `Here are some of my key projects...`,
      tool: "getProjects"
    };

    replies["Can I see your resume?"] = {
      reply: `Here's my resume with all the details...`,
      tool: "getResume"
    };

    replies["How can I reach you?"] = {
      reply: `Here's how you can reach me...`,
      tool: "getContact"
    };

    replies["Am I available for opportunities?"] = {
      reply: `Here are my current opportunities and availability...`,
      tool: "getInternship"
    };

    replies["Tell me a joke"] = {
      reply: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      tool: "none"
    };

    replies["Greeting"] = {
      reply: "Hi! I'm Keshore's Assistant. I'm here to help you explore his portfolio, skills, and projects. Ask me anything!",
      tool: "none"
    };

    // Add specific projects automatically
    this.config.projects.forEach(project => {
      replies[project.title] = {
        reply: project.description,
        tool: `getProject:${project.title}`
      };
    });

    return replies;
  }

  // Generate resume details
  generateResumeDetails() {
    return this.config.resume;
  }

  // Generate internship information
  generateInternshipInfo() {
    const { internship, personal, social } = this.config;

    if (!internship.seeking) {
      return "I'm not currently seeking internship opportunities.";
    }

    return `Here's what I'm looking for 👇

- 📅 **Duration**: ${internship.duration} starting **${internship.startDate}**
- 🌍 **Location**: ${internship.preferredLocation}
- 🧑‍💻 **Focus**: ${internship.focusAreas.join(', ')}
- 🛠️ **Working Style**: ${internship.workStyle}
- 🎯 **Goals**: ${internship.goals}

📬 **Contact me** via:
- Email: ${personal.email}
- LinkedIn: ${social.linkedin}
- GitHub: ${social.github}

${internship.availability} ✌️`;
  }

  // Get all configuration data
  getConfig(): PortfolioConfig {
    return this.config;
  }
}

export default ConfigParser;
