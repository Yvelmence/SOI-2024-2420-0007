const tf = require('@tensorflow/tfjs-node');

const MODEL_CLASSES = ["Kidney", "Lung"];

// Function to preprocess the image and make predictions
const predictImage = async (model, buffer) => {
  const tensor = tf.tidy(() => {
    const decodedImage = tf.node.decodeImage(buffer);
    return decodedImage
      .resizeBilinear([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims();
  });

  const predictions = await model.predict(tensor).data();
  tensor.dispose();

  const predictedIndex = Array.from(predictions).indexOf(Math.max(...predictions));
  const confidence = (predictions[predictedIndex] * 100).toFixed(2);

  return {
    label: MODEL_CLASSES[predictedIndex],
    confidence: `${confidence}%`,
  };
};

module.exports = predictImage;
