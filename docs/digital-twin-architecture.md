# Digital Twin Teacher: Technical Architecture

This document outlines the blueprint for deploying a "Digital Twin" of FAMU faculty using Google Cloud and Vertex AI.

## 1. Intelligence Layer (The Brain)
- **Model**: Vertex AI Gemini 1.5 Pro.
- **Context**: Fine-tuned or grounded using RAG (Retrieval Augmented Generation) on faculty lecture notes, publications, and syllabi.
- **Personality**: System instructions define the "Rattler Mentor" persona, ensuring a specific tone and pedagogical approach.

## 2. Vocal Layer (The Voice)
- **Service**: Google Cloud Text-to-Speech (TTS).
- **Technology**: 
    - **Neural2 Voices**: High-fidelity pre-built voices.
    - **Custom Voice**: Training a model on 3-5 hours of faculty voice recordings to create a unique biological clone.
- **Output**: SSML (Speech Synthesis Markup Language) to control emphasis, pitch, and speed for natural lecturing.

## 3. Visual Layer (The Presence)
- **Avatar Generation**: Integration with Vertex AI specialized models or third-party APIs (e.g., HeyGen, D-ID) to animate a static image.
- **Lip-Sync**: Aligning phonemes from the audio output with the visual mouth movements of the avatar.
- **Environment**: Using Imagen 3 to generate consistent university-branded backgrounds (e.g., the FAMU Eternal Flame or Lee Hall).

## 4. Integration Flow
1. **User Input**: Student asks a question in the Lab.
2. **Genkit Flow**: 
    - LLM generates response text.
    - TTS generates audio file.
    - Animation engine generates video frames.
3. **Frontend**: The `DigitalTwinPlayer` component streams the combined media back to the student.
