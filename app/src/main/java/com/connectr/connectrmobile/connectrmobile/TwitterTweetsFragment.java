package com.connectr.connectrmobile.connectrmobile;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;

import java.util.ArrayList;

/**
 * Created by Johnny on 3/5/16.
 */
public class TwitterTweetsFragment extends Fragment {

    private static final String TWITTER_TRENDS_KEY = "TWITTER_TRENDS_KEY";

    public static TwitterTweetsFragment newInstance(ArrayList<String> topTenTweets) {
        Bundle args = new Bundle();
        args.putStringArrayList(TWITTER_TRENDS_KEY, topTenTweets);
        TwitterTweetsFragment fragment = new TwitterTweetsFragment();
        fragment.setArguments(args);
        return fragment;
    }
}
