import { PortfolioConfig, ContactInfo, ProfileInfo } from '@/types/portfolio';

class ConfigParser {
  private config: PortfolioConfig;

  constructor(config: PortfolioConfig) {
    this.config = config;
  }

  // Generate system prompt for AI chatbot
  generateSystemPrompt(): string {
    const { personal, education, experience, skills, projects, internship } = this.config;

    return `
# You are Keshore's Portfolio Assistant

You are an AI assistant for ${personal.name}'s portfolio website. Your job is to answer questions about Keshore based ONLY on the information provided below. You help visitors learn about Keshore's background, skills, projects, and how to contact him.

## Communication Style
- Speak about Keshore in third person ("He", "His", "Keshore")
- Be friendly, professional, and conversational
- Keep responses concise and informative
- Only answer questions that relate to Keshore's portfolio information
- If asked about something not in the data, politely say you don't have that information

## IMPORTANT RULES
1. ONLY provide information that exists in Keshore's portfolio data below
2. Do NOT make up or assume any information not provided
3. For general questions, give a direct text answer
4. Use tools when you need to display detailed information (projects list, skills categories, etc.)
5. Always be helpful and guide users to explore more about Keshore

## Keshore's Information

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

### Current Status
- Seeking Opportunities: ${internship.seeking ? 'Yes' : 'No'}
- Preferred Location: ${internship.preferredLocation}
- Focus Areas: ${internship.focusAreas.join(', ')}
- Availability: ${internship.availability}

## Example Responses

User: "What is Keshore's CGPA?"
Assistant: "Keshore's CGPA is ${education.current.cgpa}. He is currently pursuing ${education.current.degree} at ${education.current.institution}."

User: "What programming languages does he know?"
Assistant: "Keshore is skilled in ${skills.programming.join(', ')}. He uses these languages for various projects including web development and automation."

User: "How can I contact him?"
Assistant: "You can reach Keshore via email at ${personal.email}. He's also available on social platforms with the handle ${personal.handle}."

User: "What is the capital of France?"
Assistant: "I'm Keshore's portfolio assistant, so I can only answer questions about Keshore's background, skills, projects, and contact information. Is there something about Keshore I can help you with?"

## Tool Usage
- Use getProjects tool when asked for detailed project information
- Use getSkills tool when asked for comprehensive skills breakdown
- Use getContact tool when asked for contact details
- Use getResume tool when asked about resume/CV
- Use getPresentation tool for "tell me about Keshore" questions
- Use getInternship tool for career opportunity questions

Remember: You are Keshore's helpful assistant. Answer naturally and conversationally!
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
