import graphene
from django.contrib.auth.models import User
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from . import models


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        filter_fields = {}
        interfaces = (relay.Node,)


class StoreNode(DjangoObjectType):
    class Meta:
        model = models.Store
        filter_fields = {}
        interfaces = (relay.Node,)


class ProductNode(DjangoObjectType):
    class Meta:
        model = models.Product
        filter_fields = {}
        interfaces = (relay.Node,)


class OrderNode(DjangoObjectType):
    class Meta:
        model = models.Order
        filter_fields = {}
        interfaces = (relay.Node,)


class OrderItemNode(DjangoObjectType):
    class Meta:
        model = models.OrderItem
        filter_fields = {}
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    user = relay.Node.Field(UserNode)
    all_users = DjangoFilterConnectionField(UserNode)

    store = relay.Node.Field(StoreNode)
    all_stores = DjangoFilterConnectionField(StoreNode)

    product = relay.Node.Field(ProductNode)
    all_products = DjangoFilterConnectionField(ProductNode)

    order = relay.Node.Field(OrderNode)
    all_orders = DjangoFilterConnectionField(OrderNode)

    order_item = relay.Node.Field(OrderItemNode)
    all_order_items = DjangoFilterConnectionField(OrderItemNode)


schema = graphene.Schema(query=Query)
