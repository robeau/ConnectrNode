package com.connectr.connectrmobile.connectrmobile;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.firebase.client.Firebase;

/**
 * Created by Johnny on 3/5/16.
 */
public class AlexaFragment extends Fragment {

    private Firebase mFirebaseRef;

    public static AlexaFragment newInstance() {
        return new AlexaFragment();
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_alexa, container, false);

        Firebase.setAndroidContext(getActivity());
        mFirebaseRef = new Firebase("https://dazzling-inferno-6316.firebaseio.com/");

        return v;
    }
}
