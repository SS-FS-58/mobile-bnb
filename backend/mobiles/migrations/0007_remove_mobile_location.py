# Generated by Django 3.1.4 on 2020-12-04 15:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mobiles', '0006_merge_20201204_1536'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mobile',
            name='location',
        ),
    ]
