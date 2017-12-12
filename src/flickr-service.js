import jsonp from "jsonp"
import { flickrApiKey } from "./config.js"

const getPublicPhotoFeed = (complete, error) => {
    jsonp("https://api.flickr.com/services/feeds/photos_public.gne?format=json", {
        param: "jsoncallback"
    }, function(err, data) {
        if(err != null) {
            error(err);
        } else {
            complete(data);
        }
    });
};

const getInfo = (userId, complete, error) => {
    jsonp(`https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=${flickrApiKey}&user_id=${userId}&format=json`, {
        param: "jsoncallback"
    }, function(err, data) {
        if(err != null) {
            error(err);
        } else {
            complete(data);
        }
    });
};

const getPublicPhotos = (userId, complete, error) => {
    jsonp(`https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${flickrApiKey}&user_id=${userId}&format=json`, {
        param: "jsoncallback"
    }, function(err, data) {
        if(err != null) {
            error(err);
        } else {
            complete(data);
        }
    });
};

export { getPublicPhotoFeed, getInfo, getPublicPhotos };
