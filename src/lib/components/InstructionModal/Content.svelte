<h2>The Process</h2>

<p>
	Upload a picture of yourself, or even include some friends in the picture, and watch in amazement
	as you all become Shrekified. Your skin will turn green and you will get Shrek ears. At that
	point, the picture is yours for whatever.
</p>

<h2>Behind the Scenes</h2>

<p>
	The image is shrunk and sent off to a server to be processed, where it is read pixel by pixel to
	determine which ones to turn green. Afterwards, a simple face detection is done and Shrek ears are
	sized and placed. The image gets returned to the browser where it is displayed to be downloaded or
	shared.
</p>

<h2>Tips</h2>

<p>
	While Shrekify can be a lot of fun, it is also really bad. I am serious. Do NOT expect a lot. It
	commonly misses faces and will determine that some pixels in the image are a skin color when they
	are really just part of some random object. I did not actually write nor improve the code for
	detecting skin color or faces, I just found it and pieced it all together. I will likely never
	improve it, because this whole thing is just something I did for fun.
</p>

<p>
	With that said, there are some things you can do to get a better result, either for pictures that
	you are taking in real-time or when looking for a good picture to Shrekify...
</p>

<ul>
	<li>
		Avoid skin colored clothes or things in the background of the picture. Those will likely get
		turned green.
	</li>
	<li>
		Make sure all faces are turned toward the camera, otherwise they might not get detected and will
		not get ears.
	</li>
	<li>Good lighting. Not too bright, not too dark. Using flash might not turn out great.</li>
	<li>Have fun. This thing is far from perfect.</li>
</ul>

<h2>Disclaimers</h2>

<p>To avoid any confusion, just wanted to include the following...</p>

<ul>
	<li>We never see the image that you upload, and it is never saved.</li>
	<li>I did not write any of the code for the face or skin color detection.</li>
	<li>I did test to make sure there was no clear discrimination happening.</li>
</ul>

<style>
	ul {
		list-style-type: '🤢';
	}

	li {
		padding: 0 0 8px 8px;
	}

	li::marker {
		font-size: 16px;
	}
</style>
