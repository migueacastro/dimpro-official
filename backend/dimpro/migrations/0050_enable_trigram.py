from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('dimpro', '0049_invoice_alter_user_options'),
    ]

    operations = [
        migrations.RunSQL(
            sql="CREATE EXTENSION IF NOT EXISTS pg_trgm;",
            reverse_sql="DROP EXTENSION IF EXISTS pg_trgm;",
        ),
    ]