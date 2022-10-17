FROM public.ecr.aws/lambda/nodejs:16

# Install necessary packages for building node-canvas
RUN yum -y update \
&& yum -y groupinstall "Development Tools" \
&& yum install -y nodejs gcc-c++ cairo-devel \
	libjpeg-turbo-devel pango-devel giflib-devel \
	zlib-devel librsvg2-devel

# Copy function code
COPY package.json index.js ${LAMBDA_TASK_ROOT}
COPY assets/* ${LAMBDA_TASK_ROOT}/assets/
COPY models/* ${LAMBDA_TASK_ROOT}/models/
COPY utils/*.js ${LAMBDA_TASK_ROOT}/utils/

# Install NPM dependencies for function
RUN npm install

ENV LD_PRELOAD=/var/task/node_modules/canvas/build/Release/libz.so.1

# Remove necessary packages for building node-canvas
RUN yum remove -y cairo-devel libjpeg-turbo-devel \
		pango-devel giflib-devel zlib-devel librsvg2-devel

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.shrekify" ]
