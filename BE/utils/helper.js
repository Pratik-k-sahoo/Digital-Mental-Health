const K_ANONYMITY = 5;

function enforceKAnonymity(rows, countField = "count") {
	return rows.filter((row) => Number(row[countField]) >= K_ANONYMITY);
}

module.exports = { enforceKAnonymity };