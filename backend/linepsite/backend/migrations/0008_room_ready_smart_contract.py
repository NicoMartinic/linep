# Generated by Django 3.1.7 on 2023-10-05 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_auto_20230925_1812'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='ready_smart_contract',
            field=models.BooleanField(default=False),
        ),
    ]
