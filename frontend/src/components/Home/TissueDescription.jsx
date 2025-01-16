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
    <div className="w-full max-w-2xl rounded-lg bg-gray-800 text-white mb-4 p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-3">{content.title}</h2>
      <p className="mb-4 text-base">{content.description}</p>
      {content.learningPoints.map((section, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
          <ul className="list-disc pl-6">
            {section.points.map((point, idx) => (
              <li key={idx} className="mb-1 text-gray-200">{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TissueDescription;
