function getEmailSimilarity(s1, s2){
    const len1 = s1.length;
    const len2 = s2.length;

    const matrix = [];
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [];
        for (let j = 0; j <= len2; j++) {
            if (i === 0) {
                matrix[i][j] = j;
            } else if (j === 0) {
                matrix[i][j] = i;
            } else {
                let cost = 0;
                if (s1[i - 1] !== s2[j - 1]) {
                    cost = 1;
                }
                const temp = matrix[i - 1][j - 1] + cost;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, temp)
            }
        }
    }
    return matrix[len1][len2];
}

/**
 * 邮箱正确后缀建议
 */
module.exports = class EmailSuggestion {
    constructor(suggestedSuffixes = []) {
        this.suggestedSuffixes = suggestedSuffixes;
    }

    /**
     * 根据输入的邮箱，建议可能正确的邮箱
     * @param {string} email
     *
     * @returns {array} 所有建议的邮箱
     */
    suggest(email) {
        const emailUser = email.substr(0, email.indexOf('@'));

        let suggestArr = [];
        this.suggestedSuffixes.map(emailServer => {
            const suggestEmail = [emailUser, "@", emailServer].join("");
            suggestArr.push({
                email: suggestEmail,
                similarity: getEmailSimilarity(email, suggestEmail),
            });
            return true;
        });

        suggestArr = suggestArr.sort((item1, item2) => item1.similarity - item2.similarity);

        return suggestArr.map(e => e.email);
    }
}