FROM nginx
ARG REPLACE=s|REPLACE|connectre-website|g
ENV replace=$REPLACE
RUN rm -rf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/nginx.conf
RUN sed -i $replace /etc/nginx/nginx.conf
COPY build/ /usr/share/nginx/html
