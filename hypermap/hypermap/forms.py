from django import forms

from django.contrib.auth.models import User
from django.forms.extras.widgets import SelectDateWidget
class RegistrationForm(forms.Form):
    username = forms.CharField(max_length = 50,
                               widget = forms.TextInput(attrs={'class':'form-control',
                                                               'placeholder':'Username',
                                                               'autofocus': 'autofocus'}))
    firstname = forms.CharField(max_length = 20,
                                widget = forms.TextInput(attrs={'class':'form-control',
                                                               'placeholder':'First Name'}))
    lastname = forms.CharField(max_length = 20,
                               widget = forms.TextInput(attrs={'class':'form-control',
                                                               'placeholder':'Last Name'}))
    email = forms.EmailField(max_length = 50,
                                widget = forms.EmailInput(attrs={'class':'form-control',
                                                               'placeholder':'Email'}))
    password1 = forms.CharField(max_length = 200,
                                label = 'Password',
                                widget = forms.PasswordInput(attrs={'class':'form-control',
                                                               'placeholder':'Password'}))
    password2 = forms.CharField(max_length = 200,
                                label = 'Confirm Password',
                                widget = forms.PasswordInput(attrs={'class':'form-control',
                                                               'placeholder':'Confirm Password'}))

    def clean(self):
        cleaned_data = super(RegistrationForm, self).clean()

        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords did not match.")

        return cleaned_data

    def clean_username(self):
        new_username = self.cleaned_data.get('username')
        if User.objects.filter(username = new_username):
            raise forms.ValidationError("Username is already taken.")

        return new_username

    def clean_email(self):
        new_email = self.cleaned_data.get('email')
        if User.objects.filter(email = new_email):
            raise forms.ValidationError("Email is already taken.")

        return new_email


class ActivityForm(forms.Form):
    title = forms.CharField(label="", max_length = 50,
                            widget = forms.Textarea(attrs={'class':'form-control',
                                                           'placeholder':'Event name',
                                                           'rows':'1',
                                                           'autofocus': 'autofocus'}))
    content = forms.CharField(label="", max_length = 200,
                              widget = forms.Textarea(attrs={'class':'form-control',
                                                             'rows':'2',
                                                             'cols':'20',
                                                             'placeholder':'Tell people more about the event',
                                                             'data-emojiable':'true'}))
    event_date = forms.DateField(label="Start Date ",widget = forms.SelectDateWidget())
    event_time = forms.TimeField(label="Start Time",widget=forms.TimeInput(attrs={'placeholder':'00:00:00'}))
    event_end_date = forms.DateField(label="End Date ",widget = forms.SelectDateWidget())
    event_end_time = forms.TimeField(label="End Time",widget=forms.TimeInput(attrs={'placeholder':'00:00:00'}))
    lat = forms.FloatField(widget = forms.HiddenInput())
    lng = forms.FloatField(widget=forms.HiddenInput())
    picture = forms.ImageField(label="Upload Image",required=False, widget=forms.FileInput())
    videos = forms.FileField(label="Upload Video", required=False, widget=forms.FileInput())
    tag1 = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={'data-val':'true', 'value':'true'}), label="Study")
    tag2 = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={'data-val':'true', 'value':'true'}), label="Music")
    tag3 = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={'data-val':'true', 'value':'true'}), label="Sports")


