package com.wpdf.online;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.DownloadListener;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.webkit.JavascriptInterface;
import android.util.Base64;
import java.io.File;
import java.io.FileOutputStream;

import androidx.activity.ComponentActivity;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

public class MainActivity extends ComponentActivity {
    private static final int FILE_CHOOSER_REQUEST = 4201;
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private InterstitialAd interstitialAd;
    private ConsentInformation consentInformation;
    private AdView bannerAd;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout root = new FrameLayout(this);
        webView = new WebView(this);
        bannerAd = new AdView(this);
        bannerAd.setAdSize(AdSize.BANNER);
        bannerAd.setAdUnitId("ca-app-pub-1849282438800062/8218397136");

        FrameLayout.LayoutParams wp = new FrameLayout.LayoutParams(-1, -1);
        wp.bottomMargin = dp(50);
        FrameLayout.LayoutParams ap = new FrameLayout.LayoutParams(-1, dp(50));
        ap.gravity = android.view.Gravity.BOTTOM;
        root.addView(webView, wp);
        root.addView(bannerAd, ap);
        setContentView(root);

        setupWebView();
        requestConsentAndAds();
    }

    private void setupWebView() {
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setSupportZoom(false);
        s.setTextZoom(100);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { return false; }
            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                installDownloadBridge();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (filePathCallback != null) filePathCallback.onReceiveValue(null);
                filePathCallback = callback;
                Intent intent = params.createIntent();
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                try { startActivityForResult(intent, FILE_CHOOSER_REQUEST); }
                catch (ActivityNotFoundException e) {
                    filePathCallback = null;
                    Toast.makeText(MainActivity.this, "تعذر فتح مدير الملفات", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }
        });

        webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            showInterstitialThen(() -> {
                try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); }
                catch (Exception e) { Toast.makeText(this, "تعذر فتح الملف", Toast.LENGTH_LONG).show(); }
            });
        });

        webView.loadUrl("file:///android_asset/web/index.html");
    }

    private void installDownloadBridge() {
        String js = "(function(){if(window.__wpdfAndroidBridgeInstalled)return;window.__wpdfAndroidBridgeInstalled=true;document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[download]');if(!a)return;var u=a.href||'';if((u.startsWith('blob:')||u.startsWith('data:'))&&window.AndroidBridge){e.preventDefault();fetch(u).then(function(r){return r.blob()}).then(function(b){var reader=new FileReader();reader.onloadend=function(){AndroidBridge.saveFile(a.download||'world-pdf-file',b.type||'application/octet-stream',reader.result.split(',')[1]);};reader.readAsDataURL(b);}).catch(function(){a.click()});}},true);})();";
        webView.evaluateJavascript(js, null);
    }

    private void requestConsentAndAds() {
        consentInformation = UserMessagingPlatform.getConsentInformation(this);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
        consentInformation.requestConsentInfoUpdate(this, params,
            () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(this, error -> loadAdsIfAllowed()),
            error -> loadAdsIfAllowed());
        if (consentInformation.canRequestAds()) loadAdsIfAllowed();
    }

    private void loadAdsIfAllowed() {
        if (!consentInformation.canRequestAds()) return;
        MobileAds.initialize(this, status -> runOnUiThread(() -> {
            bannerAd.loadAd(new AdRequest.Builder().build());
            loadInterstitial();
        }));
    }

    private void loadInterstitial() {
        InterstitialAd.load(this, "ca-app-pub-3940256099942544/1033173712",
            new AdRequest.Builder().build(),
            new InterstitialAdLoadCallback() {
                @Override public void onAdLoaded(InterstitialAd ad) { interstitialAd = ad; }
            });
    }

    private void showInterstitialThen(Runnable after) {
        if (interstitialAd == null) { after.run(); return; }
        interstitialAd.setFullScreenContentCallback(new com.google.android.gms.ads.FullScreenContentCallback() {
            @Override public void onAdDismissedFullScreenContent() {
                interstitialAd = null; loadInterstitial(); after.run();
            }
        });
        interstitialAd.show(this);
    }

    private int dp(int v) { return Math.round(v * getResources().getDisplayMetrics().density); }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || filePathCallback == null) return;
        Uri[] results = null;
        if (resultCode == Activity.RESULT_OK && data != null) {
            if (data.getClipData() != null) {
                int count = data.getClipData().getItemCount();
                results = new Uri[count];
                for (int i=0;i<count;i++) results[i] = data.getClipData().getItemAt(i).getUri();
            } else if (data.getData() != null) results = new Uri[]{data.getData()};
        }
        filePathCallback.onReceiveValue(results);
        filePathCallback = null;
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    public class AndroidBridge {
        @JavascriptInterface public void saveFile(String filename, String mimeType, String base64) {
            try {
                byte[] data = Base64.decode(base64, Base64.DEFAULT);
                File out = new File(getExternalFilesDir(null), filename);
                try (FileOutputStream stream = new FileOutputStream(out)) { stream.write(data); }
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "تم إنشاء الملف: " + out.getName(), Toast.LENGTH_LONG).show());
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "تعذر حفظ الملف: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }
    }
}
