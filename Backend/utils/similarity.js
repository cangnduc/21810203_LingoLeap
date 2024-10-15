const natural = ""; //require("natural");
const TfIdf = natural.TfIdf;
const math = ""; //require("mathjs");

function calculateSimilarity(text1, text2) {
  const tfidf = new TfIdf();
  tfidf.addDocument(text1);
  tfidf.addDocument(text2);

  const vec1 = {};
  const vec2 = {};

  tfidf.listTerms(0).forEach((item) => {
    vec1[item.term] = item.tfidf;
  });

  tfidf.listTerms(1).forEach((item) => {
    vec2[item.term] = item.tfidf;
  });

  return cosineSimilarity(vec1, vec2);
}

function calculateSimilarityMatrix(texts) {
  const tfidf = new TfIdf();
  texts.forEach((text) => tfidf.addDocument(text));

  const matrix = [];
  const terms = new Set();

  texts.forEach((_, docIndex) => {
    const vector = {};
    tfidf.listTerms(docIndex).forEach((item) => {
      vector[item.term] = item.tfidf;
      terms.add(item.term);
    });
    matrix.push(vector);
  });

  const termArray = Array.from(terms);
  const vectorMatrix = matrix.map((vector) =>
    termArray.map((term) => vector[term] || 0)
  );

  const normalizedMatrix = vectorMatrix.map((vector) => {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );
    return vector.map((val) => val / magnitude);
  });

  return math.multiply(normalizedMatrix, math.transpose(normalizedMatrix));
}

module.exports = { calculateSimilarityMatrix };
