FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY certificate.crt /etc/nginx/certificate.crt

COPY private.key /etc/nginx/private.key

COPY default.conf /etc/nginx/conf.d/default.conf