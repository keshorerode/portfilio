import { tool } from 'ai';
import { z } from 'zod';
import { getConfigFromDB } from "@/lib/config-db";

export const getResume = tool({
  description:
    "This tool provides information about the professional resume, including file details and download links.",
  parameters: z.object({}),
  execute: async () => {
    const config = await getConfigFromDB();

    return {
      personalInfo: {
        name: config.personal.name,
        email: config.personal.email,
        location: config.personal.location,
        traits: config.personality?.traits || [],
        interests: config.personality?.interests || [],
        motivation: config.personality?.motivation || '',
        title: config.personal.title,
        profiles: {
          github: config.social.github,
          linkedin: config.social.linkedin,
          twitter: config.social.twitter,
          kaggle: config.social.kaggle,
          leetcode: config.social.leetcode
        }
      },
      summary: config.personal.bio,
      education: {
        current: config.education.current,
        achievements: config.education.achievements
      },
      experience: config.experience.map(exp => ({
        company: exp.company,
        position: exp.position,
        duration: exp.duration,
        type: exp.type,
        description: exp.description,
        technologies: exp.technologies
      })),
      skills: config.skills,
      resume: {
        title: config.resume?.title,
        description: config.resume?.description,
        fileType: config.resume?.fileType,
        downloadUrl: config.resume?.downloadUrl
      },
      message: "I'm pleased to share my professional background with you. As you can see from my resume, I've maintained a strong focus on combining academic excellence with practical experience. Throughout my journey, I've consistently sought opportunities to apply what I learn in the classroom to real-world projects and challenges. My academic performance, combined with my hands-on experience through internships and freelance work, has given me a solid foundation in both theoretical concepts and practical implementation. I believe this combination of academic rigor and real-world application has prepared me well for contributing to your organization. Is there any particular aspect of my background you'd like me to expand on?"
    };
  },
});
