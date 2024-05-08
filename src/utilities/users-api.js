export async function signUp ( userData )
{
	// Fetch uses an options object as a second arg to make requests
	// other than basic GET requests, include data, headers, etc.
	const res = await fetch( "/api/user/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		// Fetch requires data payloads to be stringified
		// and assigned to a body property on the options object
		body: JSON.stringify( userData ),
	} );
	const data = await res.json();
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return data;
	} else if ( data.keyPattern && data.keyPattern.email )
	{
		throw new Error( "email taken" );
	} else
	{
		throw new Error( "Invalid Sign Up" );
	}
}

export async function login ( userData )
{
	// Fetch uses an options object as a second arg to make requests
	// other than basic GET requests, include data, headers, etc.
	const res = await fetch( "/api/user/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		// Fetch requires data payloads to be stringified
		// and assigned to a body property on the options object
		body: JSON.stringify( userData ),
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		throw new Error( "Invalid Sign Up" );
	}
}

export async function AddLocation ( formData )
{
	console.info( "===========[] ===========[AddLocation] : ", formData );;
	const res = await fetch( "/api/location/create-location", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		// Fetch requires data payloads to be stringified
		// and assigned to a body property on the options object
		body: JSON.stringify( formData ),
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		throw new Error( "Invalid Sign Up" );
	}
}

export async function UpdateLocation ( formData )
{
	const res = await fetch( "/api/location/update-location", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		// Fetch requires data payloads to be stringified
		// and assigned to a body property on the options object
		body: JSON.stringify( formData ),
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		throw new Error( "Invalid Sign Up" );
	}
}

export async function getCategoryList ()
{
	const query = new URLSearchParams( { page: '1', page_size: '100' } ).toString();
	const res = await fetch( `/api/category/lists?${ query }`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		throw new Error( "Invalid" );
	}
}

export async function getListLocationByCateId ( id )
{
	const query = new URLSearchParams( { page: '1', page_size: '1000', category_id: id } ).toString();
	const res = await fetch( `/api/category/lists?${ query }`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		throw new Error( "Invalid" );
	}
}

export async function AddReviewLocation ( formData )
{
	console.info( "===========[] ===========[AddReviewLocation] : ", formData );
	const res = await fetch( "/api/reviews", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify( formData ),
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		throw new Error( "Invalid Sign Up" );
	}
}

export const getListUser = async ( filters ) =>
{
	console.info( "===========[] ===========[getListUser] : ", filters );
	const query = new URLSearchParams( { ...filters } ).toString();
	const res = await fetch( "/api/user/list?" + query, {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		throw new Error( "Invalid" );
	}
}

export const statistic = async ( filters ) =>
{
	console.info( "===========[] ===========[getListUser] : ", filters );
	const query = new URLSearchParams( { ...filters } ).toString();
	const res = await fetch( "/api/statistic/all?" + query, {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		throw new Error( "Invalid" );
	}
}

export const updateUser = async ( id, formData ) =>
{
	const res = await fetch( "/api/user/update/" + id, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify( formData ),
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		return {
			status: res?.status,
			message: res?.statusText
		}
	}
}

export const deleteUser = async ( id ) =>
{
	const res = await fetch( "/api/user/delete/" + id, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" }
	} );
	// Check if request was successful
	if ( res.ok )
	{
		// res.json() will resolve to the JWT
		return res.json();
	} else
	{
		return {
			status: res?.status,
			message: res?.statusText
		}
	}
}

export const BLOG_SERVICE = {
	async update ( id, formData )
	{
		const res = await fetch( "/api/blog/update/" + id, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify( formData ),
		} );
		// Check if request was successful
		if ( res.ok )
		{
			// res.json() will resolve to the JWT
			return res.json();
		} else
		{
			return {
				status: res?.status,
				message: res?.statusText
			}
		}
	},

	async create (formData )
	{
		const res = await fetch( "/api/blog/create" , {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify( formData ),
		} );
		// Check if request was successful
		if ( res.ok )
		{
			// res.json() will resolve to the JWT
			return res.json();
		} else
		{
			return {
				status: res?.status,
				message: res?.statusText
			}
		}
	},

	async getList ( filters)
	{
		const query = new URLSearchParams( { ...filters } ).toString();
		const res = await fetch( "/api/blog/list?" + query, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		} );
		// Check if request was successful
		if ( res.ok )
		{
			// res.json() will resolve to the JWT
			return res.json();
		} else
		{
			return {
				status: res?.status,
				message: res?.statusText
			}
		}
	},

	async show ( id )
	{
		const res = await fetch( "/api/blog/show/" + id, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		} );
		// Check if request was successful
		if ( res.ok )
		{
			// res.json() will resolve to the JWT
			return res.json();
		} else
		{
			return {
				status: res?.status,
				message: res?.statusText
			}
		}
	},

	async deleteData ( id )
	{
		const res = await fetch( "/api/user/delete/" + id, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		} );
		// Check if request was successful
		if ( res.ok )
		{
			// res.json() will resolve to the JWT
			return res.json();
		} else
		{
			return {
				status: res?.status,
				message: res?.statusText
			}
		}
	},

}