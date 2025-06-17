import * as ADB from "./adb"
import * as ClickHouse from "./clickhouse"
import * as Oracle from "./oracle"
import * as BigQuery from "./bigquery"

const keywordMap = {
	adb: {
		...ADB,
	},
	clickhouse: {
		...ClickHouse,
	},
	mysql: {
		...ADB,
	},
	oracle: {
		...Oracle,
	},
	starrocks: {
		...ADB,
	},
	bigquery: {
		...BigQuery,
	},
	cloudsql: {
		...ADB,
	},
	rds: {
		...ADB,
	},
	polardb: {
		...ADB,
	},
}

export default keywordMap
