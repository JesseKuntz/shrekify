<div class="wave-container">
	<svg viewBox="0 0 1440 160" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<style type="text/css">
				.wave {
					animation: wave 4s linear infinite;
				}

				.wave1 {
					animation: wave1 5s linear infinite;
				}

				.wave2 {
					animation: wave2 6s linear infinite;
				}

				@keyframes wave {
					0% {
						transform: translateX(0%);
					}

					100% {
						transform: translateX(100%);
					}
				}

				@keyframes wave1 {
					0% {
						transform: scaleY(1.2) translateX(0%);
					}

					100% {
						transform: scaleY(1.2) translateX(100%);
					}
				}

				@keyframes wave2 {
					0% {
						transform: scaleY(0.8) translateX(0%);
					}

					100% {
						transform: scaleY(0.8) translateX(100%);
					}
				}
			</style>
			<path
				id="sine-wave"
				fill="#5b1717"
				fill-opacity="0.6"
				d="M0,80 C320,150,420,150,740,80 C1060,0,1120,0,1440,80 V0 H0"
			/>
		</defs>
		<use class="wave" href="#sine-wave" />
		<use class="wave" x="-100%" href="#sine-wave" />
		<use class="wave1" href="#sine-wave" />
		<use class="wave1" x="-100%" href="#sine-wave" />
		<use class="wave2" href="#sine-wave" />
		<use class="wave2" x="-100%" href="#sine-wave" />
	</svg>
</div>

<style>
	.wave-container {
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 0;
	}
</style>
