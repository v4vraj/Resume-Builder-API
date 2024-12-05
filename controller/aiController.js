require("dotenv").config();
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HUGGING_FACE_API_KEY);

exports.generateDescription = async (req, res) => {
  const { title, description } = req.body;
  try {
    const chatCompletion = await client.chatCompletion({
      model: "microsoft/Phi-3-mini-4k-instruct",
      messages: [
        {
          role: "user",
          content: `Please improve the grammar of the following description: "${description}". Ensure that the revised description aligns with the title "${title}", focusing on the key skills, experiences, and responsibilities relevant to this role. The revised description should be appropriate and tailored for the provided title, showcasing the essential qualifications and experiences for that job.`,
        },
      ],
      max_tokens: 500,
    });
    console.log("Response:", chatCompletion);
    if (chatCompletion.choices && chatCompletion.choices[0]) {
      const description =
        chatCompletion.choices[0].message.content ||
        "No description generated.";
      res.json({ description });
    } else {
      res.status(500).json({ error: "Unable to generate description." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
