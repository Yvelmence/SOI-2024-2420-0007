import React from 'react';

const educationalContent = {
  lung: {
    title: "Lung Anatomy and Histology",
    description: "Lung anatomy and histology is designed to allow passage of air as well as exchange of oxygen and carbon dioxide for respiration.",
    learningPoints: [
      {
        title: "Key Histological Structures",
        points: [
          "bronchioles (tiny airways for passage of air)",
          "alveoli and alveolar ducts (sites of gaseous exchange)",
          "supporting structures such as blood vessels"
        ]
      },
      {
        title: "Technical Information",
        points: [
          "suitable stains for lung specimens",
          "the stain used in a given section",
          "procedural errors in specimen preparation, processing and staining"
        ]
      }
    ]
  },
  kidney: {
    title: "Kidney Anatomy and Histology",
    description: "Normal kidney anatomy and histology allows the kidney to conduct its function of waste removal from the bloodstream through renal ultrafiltration and selective reabsorption.",
    learningPoints: [
      {
        title: "Key Histological Structures",
        points: [
          "Blood vessels (for blood flow to the kidney nephron for removal of waste)",
          "Glomerulus (encompassed by the Bowman's capsule, is the start of kidney nephron, where renal ultrafiltration occurs)",
          "Renal tubules (where absorption and excretion of various substances occur at)"
        ]
      },
      {
        title: "Technical Information",
        points: [
          "Identifying suitable stains for kidney specimens",
          "Finding out the stain used in a given section",
          "Understanding and pointing out procedural errors in specimen preparation, processing and staining"
        ]
      }
    ]
  }
};

function TissueDescription({ organType }) {
  const content = educationalContent[organType?.toLowerCase()];
  if (!content) return null;

  return (
    <div className="w-full rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        {content.title}
      </h2>
      <p className="mb-6 text-gray-300">{content.description}</p>
      {content.learningPoints.map((section, index) => (
        <div key={index} className="mb-6 last:mb-0">
          <h3 className="text-xl font-semibold mb-3 text-white">{section.title}</h3>
          <ul className="space-y-2">
            {section.points.map((point, idx) => (
              <li key={idx} className="flex items-start text-gray-300">
                <span className="mr-2 text-pink-500">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TissueDescription;
