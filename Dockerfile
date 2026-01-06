# Use the official PHP image
FROM php:8.2-apache

# Install necessary PHP extensions
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Enable Apache
RUN a2enmod rewrite \
	&& { echo '<Directory /var/www/html/>\n\tOptions Indexes FollowSymLinks\n\tAllowOverride All\n\tRequire all granted\n</Directory>' > /etc/apache2/conf-available/app.conf; a2enconf app.conf; }

# Set the working directory
WORKDIR /var/www/html

# Copy the project code into the container
COPY --chown=www-data:www-data . /var/www/html

# Expose HTTP port
EXPOSE 80