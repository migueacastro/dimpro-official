# Generated by Django 5.1.5 on 2025-06-06 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dimpro', '0037_alter_order_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='seller_name',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
