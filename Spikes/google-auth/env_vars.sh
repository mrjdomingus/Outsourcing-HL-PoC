#!/usr/bin/env bash

export COMPOSER_PROVIDERS='{ 
	"google": { 
		"provider": "google", 
		"module": "passport-google-oauth2", 
		"clientID": "269537765601-01e2u9ms8p58b0flnru7ifiqmmagtp89.apps.googleusercontent.com", 
		"clientSecret": "Mp9vnNYjiZanmB-8VFKV_jo6", 
		"authPath": "/auth/google", 
		"callbackURL": "/auth/google/callback", 
        "scope": "https://www.googleapis.com/auth/userinfo.profile",
		"successRedirect": "/", 
		"failureRedirect": "/" 
	} 
} 
'

composer-rest-server -c admin@outsourcing-network -a true -m true -w
