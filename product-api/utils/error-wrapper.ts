export const errorHandler = (lambda) => {
    return async function (event, context) {
      let body;
      let statusCode;
  
      try {
        body = await lambda(event, context);
        statusCode = 200;
      } catch (error) {
        console.log(`Error ${error} was occurred, while resolving the event: ${event}`);
  
        body = { error: error.message };
        statusCode = error.statusCode || 500;
      }
  
      return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      };
    };
  }