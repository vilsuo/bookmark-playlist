export const SKIP_SECONDS = 10;

/**
 * depicting non-selected category in album category select option
 */
export const CATEGORY_OTHER = "";

export const CATEGORY_ALL = "-- All --";

const ORIGIN = 'http://localhost:5173';

/**
 * https://developers.google.com/youtube/player_parameters
 */
export const BASE_PLAYER_VARS = {
  // autoplay
  // cc_lang_pref
  // cc_load_policy
  // color
  // controls
  // disablekb
  
  // enables the player to be controlled via IFrame Player API calls
  enablejsapi: 1,

  // end
  
  // prevent the fullscreen button from displaying in the player
  fs: 0,

  // hl
  // iv_load_policy
  // list
  // listType
  // loop
  // modestbranding
  
  // This parameter provides an extra security measure for the IFrame API and
  // is only supported for IFrame embeds. If you are using the IFrame API, which
  // means you are setting the enablejsapi parameter value to 1, you should always
  // specify your domain as the origin parameter value.
  origin, ORIGIN,

  // playlist
  // playsinline
  // rel
  // start
  // widget_referrer
};