import { TacticalSidebar } from "@/components/TacticalSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminToolbar } from "@/components/AdminToolbar";
import { Code, Database, Globe, Wrench, Brain, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { EditableSkillCategory, SkillCategory } from "@/components/EditableSkillCategory";
import { EditableText } from "@/components/EditableText";
import { EditableTechStack } from "@/components/EditableTechStack";
import { EditableCertifications } from "@/components/EditableCertifications";
import { EditableTraining } from "@/components/EditableTraining";

const skillCategories: SkillCategory[] = [
  {
    id: "cat_frontend",
    title: "Frontend Development",
    icon: "Globe",
    skills: [
      { id: "skill_react", name: "React.js", level: 95 },
      { id: "skill_typescript", name: "TypeScript", level: 90 },
      { id: "skill_tailwind", name: "Tailwind CSS", level: 95 },
      { id: "skill_nextjs", name: "Next.js", level: 85 },
      { id: "skill_vuejs", name: "Vue.js", level: 75 },
    ],
  },
  {
    id: "cat_backend",
    title: "Backend Development",
    icon: "Database",
    skills: [
      { id: "skill_nodejs", name: "Node.js", level: 90 },
      { id: "skill_express", name: "Express.js", level: 90 },
      { id: "skill_python", name: "Python", level: 80 },
      { id: "skill_postgresql", name: "PostgreSQL", level: 85 },
      { id: "skill_mongodb", name: "MongoDB", level: 85 },
    ],
  },
  {
    id: "cat_tools",
    title: "Development Tools",
    icon: "Wrench",
    skills: [
      { id: "skill_git", name: "Git & GitHub", level: 95 },
      { id: "skill_docker", name: "Docker", level: 80 },
      { id: "skill_aws", name: "AWS", level: 75 },
      { id: "skill_cicd", name: "CI/CD", level: 85 },
      { id: "skill_jest", name: "Testing (Jest)", level: 85 },
    ],
  },
  {
    id: "cat_soft",
    title: "Soft Skills",
    icon: "Brain",
    skills: [
      { id: "skill_problem", name: "Problem Solving", level: 95 },
      { id: "skill_leadership", name: "Team Leadership", level: 85 },
      { id: "skill_communication", name: "Communication", level: 90 },
      { id: "skill_agile", name: "Agile/Scrum", level: 90 },
      { id: "skill_review", name: "Code Review", level: 90 },
    ],
  },
];

const iconMap = { Code, Database, Globe, Wrench, Brain, Shield };

const certifications = [
  { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2023" },
  { name: "React Advanced Patterns", issuer: "Frontend Masters", year: "2023" },
  { name: "Full Stack Web Development", issuer: "Udacity", year: "2022" },
  { name: "Agile Project Management", issuer: "Scrum Alliance", year: "2022" },
];

const techStack = [
  "React", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Express",
  "Next.js", "Tailwind", "Docker", "AWS", "Git", "Jest",
  "Redux", "GraphQL", "REST API", "Webpack", "Vite", "Python",
];

const currentTraining = [
  { course: "Advanced System Design", progress: 75 },
  { course: "Machine Learning Fundamentals", progress: 45 },
  { course: "Microservices Architecture", progress: 60 },
];

export default function Skills() {
  const { isOwner } = useAuth();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminToolbar />
      <TacticalSidebar />
      <div className={`flex-1 ${isOwner ? 'pt-[60px]' : ''}`}>
        <DashboardHeader title="INTELLIGENCE" classification="CAPABILITY ASSESSMENT" />
        <main className="p-6 space-y-6">
          {/* Skills Grid */}
          <EditableSkillCategory
            storageKey="skills_categories"
            initialCategories={skillCategories}
            icons={iconMap}
          />

          {/* Technologies */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">TECHNOLOGY STACK</h2>
            </div>
            <EditableTechStack
              storageKey="tech_stack"
              initialTechs={techStack}
            />
          </div>

          {/* Certifications */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">CERTIFICATIONS & TRAINING</h2>
            </div>
            <EditableCertifications
              storageKey="certifications"
              initialCerts={certifications}
            />
          </div>

          {/* Learning Progress */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">CURRENT TRAINING</h2>
            </div>
            <EditableTraining
              storageKey="current_training"
              initialTraining={currentTraining}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
