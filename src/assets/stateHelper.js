function getCurrentConfiguration() {
    const serializedConfig = window.localStorage.getItem('_cap_current_config');
    console.log(`serializedConfig=${serializedConfig}`);
    if (serializedConfig) {
        return JSON.parse(serializedConfig);
    } else {
        return null;
    }
}

function getOidcConfig(authOptions) {
    let cfg = {
        authority: authOptions.authority, // la autoridad es el ADFS
        client_id: authOptions.appId, // el identificador de la aplicación creado en ADFS,
        client_secret: authOptions.secret, // secreto de la aplicación. Su uso está rotundamente desaconsejado para aplicaciones SPA.
        // redirect_uri: redirect_uri,
        // popup_redirect_uri: redirect_uri,
        scope: authOptions.scopes, //'openid profile', // + Constants.sampleApiId , // scopes solicitados: openid necesario para hacer la identificación, profile para obtener los datos de perfil del usuario.
        response_type: 'code', // al indicar este tipo de respuesta el STS está asumiendo el code grant + pkce. La respuesta tendrá únicamente el code y será necesaria una llamada al /token endpoint para recuperar los tokens.
        // post_logout_redirect_uri: logout_redirect_uri, // página a la que redirigir al usuario después de cerrar la sesión.
        // popup_post_logout_redirect_uri: logout_redirect_uri,
        userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }), // información específica del oidc-client. Se indica dónde se guarda la información del usuario en lado cliente. Es importante que coincida con la gestionada en las página de redirección
        automaticSilentRenew: true, // si se indica true el oidc-client intentará reautenticarse en segundo plano y sin solicitar credenciales al usuario.
        // silent_redirect_uri: silent_redirect_uri, // página donde se redirigen las respuestas de las autenticaciones silenciosas
        popupWindowTarget: "_blank", // es necesario indicar blank para que abra el navegador externamente a la aplicación.
        loadUserInfo: false, // indica si se debe cargar la información del usuario o no. oidc-client intenta acceder a un endpoint que ADFS tiene disponible pero para el cual no se puede configurar CORS y por tanto es incompatible con aplicaciones SPA. En cualquier caso es información secundaria ya que la misma información se encuentra en el id_token
        // extraQueryParams: extraParams
    };
    return cfg;
}

function getCurrentOidcConfig() {
    let currentAuthConfig = getCurrentConfiguration();
    return getOidcConfig(currentAuthConfig);
}

