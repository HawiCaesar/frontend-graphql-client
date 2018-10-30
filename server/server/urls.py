from django.conf.urls import url
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from app import schema

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^graphql/',
        csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema.apollo_schema))
        ),
    url(r'^graphql-relay/',
        csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema.relay_schema))
        ),
]
