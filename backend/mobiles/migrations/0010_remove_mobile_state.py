# Generated by Django 3.1.3 on 2020-12-11 11:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mobiles', '0009_mobile_state'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mobile',
            name='state',
        ),
    ]
