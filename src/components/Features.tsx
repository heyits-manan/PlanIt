import { CheckCircle2Icon, UsersIcon, LayoutDashboardIcon } from "lucide-react";

const features = [
  {
    icon: <CheckCircle2Icon className="text-blue-600" size={40} />,
    title: "Streamlined Workflow",
    description: "Simplify task management with our drag-and-drop interface.",
  },
  {
    icon: <UsersIcon className="text-blue-600" size={40} />,
    title: "Team Collaboration",
    description: "Real-time updates and seamless team communication.",
  },
  {
    icon: <LayoutDashboardIcon className="text-blue-600" size={40} />,
    title: "Flexible Boards",
    description: "Customize boards to match your unique workflow.",
  },
];

export function Features() {
  return (
    <section className="py-16 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Teams Love PlanIt
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg 
              transition-all text-center flex flex-col items-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
