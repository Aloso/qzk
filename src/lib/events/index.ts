export interface Auth {
	username: string
	password: string
}

export function authorizedHeaders({ username, password }: Auth) {
	return { Authorization: `${username}@${password}` }
}
