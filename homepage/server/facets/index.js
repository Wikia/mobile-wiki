/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function index(request, reply) {
    var data = {
        title: 'Wikia Japan Homepage',
        message: 'Placeholder content'
    };

    return reply.view('index', data);
}

module.exports = index;
