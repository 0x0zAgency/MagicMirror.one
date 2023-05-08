import server from '../../server.mjs';

export const settings = {
	requireLogin: true,
	admin: false,
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let address = res.query.address || req.session.siwe.address;
	let page = res.query.page || 0;
	//search for the address in the database
	let enses = await server.prisma.eNS.findMany({
		where: {
			domainName: {
				contains: address,
			},
		},
		skip: page * server.config.magicMirror.pageMax,
		take: server.config.magicMirror.pageMax,
	});

	return success(res, {
		enses,
	});
};
