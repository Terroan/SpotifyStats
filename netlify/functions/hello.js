exports.handler = async (event, context) => {
    return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Fehler beim Erstellen der Playlist', error: error.message }),
      };
};