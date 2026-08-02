"use client";

import { SceneController } from "@/src/three";
import StandardCard from "../card/standardCard/standardCard";
import SkillCard from "../card/skillCard/skillCard";
import BottomTab from "./bottomTab";
import TypeScriptIcon from "@/src/components/icons/about/typeScriptIcon";
import PictureCard from "../card/pictureCard/pictureCard";
import CSharpIcon from "@/src/components/icons/about/cSharpIcon";
import AzureIcon from "@/src/components/icons/about/azureIcon";
import JavaIcon from "@/src/components/icons/about/javaIcon";
import JavaScriptIcon from "@/src/components/icons/about/javaScriptIcon";
import PythonIcon from "@/src/components/icons/about/pythonIcon";
import PhpIcon from "@/src/components/icons/about/phpIcon";
import TailWindIcon from "@/src/components/icons/about/tailwindIcon";
import NextJsIcon from "@/src/components/icons/about/nextJsIcon";
import ReactIcon from "@/src/components/icons/about/reactIcon";
import MySqlIcon from "@/src/components/icons/about/mySqlIcon";
import KubernetesIcon from "@/src/components/icons/about/kubernetesIcon";
import DockerIcon from "@/src/components/icons/about/dockerIcon";
import RabbitMqIcon from "@/src/components/icons/about/rabbitMqIcon";
import KafkaIcon from "@/src/components/icons/about/kafkaIcon";
import DashedSeparator from "@/src/components/ui/dashedSeparator";
import SkillMarquee from "../skillMarquee";

const skillCategories = [
    {
        title: "Frontend",
        skills: [
            { name: "React", icon: ReactIcon, skillLevel: 8 },
            { name: "Next.js", icon: NextJsIcon, skillLevel: 8 },
            { name: "TypeScript", icon: TypeScriptIcon, skillLevel: 8 },
            { name: "JavaScript", icon: JavaScriptIcon, skillLevel: 8 },
            { name: "Tailwind", icon: TailWindIcon, skillLevel: 7 },
        ],
    },
    {
        title: "Backend",
        skills: [
            { name: "C#", icon: CSharpIcon, skillLevel: 8 },
            { name: "Java", icon: JavaIcon, skillLevel: 7 },
            { name: "Python", icon: PythonIcon, skillLevel: 6 },
            { name: "PHP", icon: PhpIcon, skillLevel: 7 },
            { name: "MySQL", icon: MySqlIcon, skillLevel: 6 },
        ],
    },
    {
        title: "Cloud & DevOps",
        skills: [
            { name: "Azure", icon: AzureIcon, skillLevel: 7 },
            { name: "Docker", icon: DockerIcon, skillLevel: 8 },
            { name: "Kubernetes", icon: KubernetesIcon, skillLevel: 7 },
            { name: "RabbitMQ", icon: RabbitMqIcon, skillLevel: 7 },
            { name: "Kafka", icon: KafkaIcon, skillLevel: 7 },
        ],
    },
];

type AboutMeTabProps = {
    enable: boolean;
    onCloseComplete: () => void;
}

export default function AboutMeTab({ enable, onCloseComplete }: AboutMeTabProps) {
    // todo - What I do, Quick facts, Skills, interests outside of coding
    // todo - prevent x-scroll which makes page go 'back', divide these into sections
    // certificates
    return (
        <BottomTab
            enable={enable}
            tabCloseTitle="ABOUT"
            onCloseComplete={onCloseComplete}
            onTabOpen={() => (SceneController.getInstance().pauseAnimationLoop())}
            onTabClose={() => (SceneController.getInstance().runAnimationLoop())}>
            <div className="overflow-hidden px-3">
                <div className="md:flex md:gap-2 md:items-center md:justify-center">
                    <div className="my-3 md:m-0">
                        <PictureCard src="/about/ethan.jpeg" alt="Picture of Ethan" title="Ethan Bower" titleDescription="Lead Full Stack Engineer" />
                    </div>
                    <div className="flex-1 max-w-200 my-3 md:my-0">
                        <StandardCard title="A Little About Me">
                            <div className="space-y-4 text-sm leading-6 text-slate-300">
                                <p>
                                    {`
                                        Hi, I'm Ethan. I'm a software developer who enjoys building projects
                                        that solve real problems and help me learn something new along the way.
                                    `}
                                </p>
                                <p>
                                    {`
                                        Most of my time is spent working with modern web technologies,
                                        experimenting with new frameworks, and turning ideas into polished
                                        applications. I enjoy the process of taking a project from a simple
                                        concept to something people can actually use.
                                    `}
                                </p>
                                <p>
                                    {`
                                        When I'm not coding, I'm usually learning about new technologies,
                                        refining old projects, or exploring interests outside of programming.
                                        I'm always looking for opportunities to grow as both a developer and a
                                        person.
                                    `}
                                </p>
                            </div>
                        </StandardCard>
                    </div>
                </div>
                <DashedSeparator />
                <div className="space-y-5">
                    {skillCategories.map((category, index) => (
                        <div key={category.title}>
                            <h2 className="mb-4 text-lg font-semibold text-white">
                                {category.title}
                            </h2>
                            <SkillMarquee skills={category.skills} reverse={index % 2 === 1} />
                        </div>
                    ))}
                </div>
            </div>
        </BottomTab>
    );
}