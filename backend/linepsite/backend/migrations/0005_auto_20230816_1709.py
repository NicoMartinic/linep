# Generated by Django 3.1.7 on 2023-08-16 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_auto_20230813_0116'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='status',
            field=models.CharField(default='created', max_length=10),
        ),
    ]
