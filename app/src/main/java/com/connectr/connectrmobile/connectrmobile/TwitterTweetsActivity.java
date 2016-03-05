package com.connectr.connectrmobile.connectrmobile;

import android.support.v4.app.Fragment;

/**
 * Created by Johnny on 3/5/16.
 */
public class TwitterTweetsActivity extends SingleFragmentActivity {

    @Override
    public Fragment createFragment() {
        return TwitterTweetsFragment.newInstance()
    }
}
